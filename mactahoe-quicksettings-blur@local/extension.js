import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const BLUR_SIGMA = 30;
const BLUR_BRIGHTNESS = 0.9;
const BLUR_SATURATION = 1.05;

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
      actor.remove_effect_by_name(name);
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

    const actors = this._getMenuActors(menu);
    if (actors.length === 0) {
      return;
    }

    actors.forEach((actor, index) => {
      const effectName = `${this.uuid}-${targetName}-${index}`;
      if (actor.get_effect && actor.get_effect(effectName)) {
        return;
      }

      const blurEffect = this._createBlurEffect();
      actor.add_effect_with_name(effectName, blurEffect);
      actor.add_style_class_name('mactahoe-glass-blur');

      this._blurredActors.push({ actor, name: effectName });
    });
  }

  _getMenuActors(menu) {
    const actors = [];
    const addActor = (actor) => {
      if (actor && !actors.includes(actor)) {
        actors.push(actor);
      }
    };

    addActor(menu.actor);
    addActor(menu.box);
    addActor(menu._boxPointer);
    addActor(menu._boxPointer?.bin);
    addActor(menu._boxPointer?.get_child?.());
    addActor(menu._boxPointer?.get_first_child?.());

    return actors;
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
