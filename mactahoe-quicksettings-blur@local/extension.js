import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const BLUR_SIGMA = 45;
const BLUR_BRIGHTNESS = 1.0;
const BLUR_SATURATION = 1.05;
const BLUR_TARGET_CLASSES = new Set([
  'quick-toggle',
  'quick-toggle-button',
  'quick-slider',
  'quick-settings-item',
  'message',
  'calendar',
]);

export default class MacTahoeQuickSettingsBlur extends Extension {
  constructor(metadata) {
    super(metadata);
    this._blurredActors = [];
    this._signals = [];
    this._idleIds = [];
  }

  enable() {
    this._blurredActors = [];
    this._signals = [];
    this._idleIds = [];
    this._bindMenu(Main.panel?.statusArea?.quickSettings?.menu, 'quicksettings');
    this._bindMenu(Main.panel?.statusArea?.dateMenu?.menu, 'datemenu');
  }

  disable() {
    for (const id of this._idleIds) {
      GLib.source_remove(id);
    }
    this._idleIds = [];

    for (const { obj, id } of this._signals) {
      if (obj && id) {
        obj.disconnect(id);
      }
    }
    this._signals = [];

    for (const { actor, name } of this._blurredActors) {
      if (!actor || actor.destroyed) {
        continue;
      }
      if (name) {
        actor.remove_effect_by_name(name);
      }
      actor.remove_style_class_name('mactahoe-glass-blur');
    }
    this._blurredActors = [];
  }

  _bindMenu(menu, targetName) {
    if (!menu) {
      return;
    }

    const apply = () => {
      this._applyMenuBlur(menu, targetName);
    };

    const idleId = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      apply();
      return GLib.SOURCE_REMOVE;
    });
    this._idleIds.push(idleId);

    if (menu.connect) {
      const signalId = menu.connect('open-state-changed', apply);
      this._signals.push({ obj: menu, id: signalId });
    }
  }

  _applyMenuBlur(menu, targetName) {
    if (!menu || !Shell.BlurEffect) {
      return;
    }

    const actors = this._collectBlurTargets(menu);
    if (actors.length === 0) {
      return;
    }

    actors.forEach((actor, index) => {
      const effectName = `${this.uuid}-${targetName}-${index}`;
      this._applyBlurToActor(actor, effectName);
    });
  }

  _collectBlurTargets(menu) {
    const root =
      menu.actor ??
      menu.box ??
      menu._boxPointer?.bin ??
      menu._boxPointer?.get_child?.() ??
      menu;

    if (!root) {
      return [];
    }

    const targets = [];
    const visit = (actor) => {
      if (!actor) {
        return;
      }
      if (this._isBlurTarget(actor)) {
        targets.push(actor);
      }
      if (actor.get_children) {
        actor.get_children().forEach((child) => visit(child));
      }
    };

    visit(root);
    return targets;
  }

  _isBlurTarget(actor) {
    if (!actor?.has_style_class_name) {
      return false;
    }
    for (const className of BLUR_TARGET_CLASSES) {
      if (actor.has_style_class_name(className)) {
        return true;
      }
    }
    return false;
  }

  _applyBlurToActor(actor, effectName) {
    if (!actor || actor.destroyed) {
      return;
    }
    if (actor.get_effect && actor.get_effect(effectName)) {
      return;
    }

    if (!this._actorHasSize(actor)) {
      this._scheduleBlurRetry(actor, effectName);
      return;
    }

    const blurEffect = this._createBlurEffect();
    actor.add_effect_with_name(effectName, blurEffect);
    actor.add_style_class_name('mactahoe-glass-blur');

    this._blurredActors.push({ actor, name: effectName });
  }

  _actorHasSize(actor) {
    if (!actor?.get_allocation_box) {
      return false;
    }
    const box = actor.get_allocation_box();
    const width = box.x2 - box.x1;
    const height = box.y2 - box.y1;
    return width >= 1 && height >= 1;
  }

  _scheduleBlurRetry(actor, effectName) {
    if (actor._mactahoeBlurTimer) {
      return;
    }
    actor._mactahoeBlurAttempts = 0;
    const id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
      if (!actor || actor.destroyed) {
        return GLib.SOURCE_REMOVE;
      }
      if (this._actorHasSize(actor)) {
        actor._mactahoeBlurTimer = null;
        this._applyBlurToActor(actor, effectName);
        return GLib.SOURCE_REMOVE;
      }
      actor._mactahoeBlurAttempts += 1;
      if (actor._mactahoeBlurAttempts > 20) {
        actor._mactahoeBlurTimer = null;
        return GLib.SOURCE_REMOVE;
      }
      return GLib.SOURCE_CONTINUE;
    });
    actor._mactahoeBlurTimer = id;
    this._idleIds.push(id);
  }

  _createBlurEffect() {
    const blurEffect = new Shell.BlurEffect();
    if ('mode' in blurEffect && Shell.BlurMode) {
      blurEffect.mode = Shell.BlurMode.BACKGROUND;
    }
    if ('sigma' in blurEffect) {
      blurEffect.sigma = BLUR_SIGMA;
    } else if ('radius' in blurEffect) {
      blurEffect.radius = BLUR_SIGMA;
    }
    if ('brightness' in blurEffect) {
      blurEffect.brightness = BLUR_BRIGHTNESS;
    }
    if ('saturation' in blurEffect) {
      blurEffect.saturation = BLUR_SATURATION;
    }
    return blurEffect;
  }
}
