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
  }

  enable() {
    this._blurredActors = [];
    this._applyMenuBlur(Main.panel?.statusArea?.quickSettings?.menu, 'quicksettings');
    this._applyMenuBlur(Main.panel?.statusArea?.dateMenu?.menu, 'datemenu');
  }

  disable() {
    for (const { actor, name } of this._blurredActors) {
      if (!actor || actor.destroyed) {
        continue;
      }
      actor.remove_effect_by_name(name);
      actor.remove_style_class_name('mactahoe-glass-blur');
    }
    this._blurredActors = [];
  }

  _applyMenuBlur(menu, targetName) {
    if (!menu || !Shell.BlurEffect) {
      return;
    }

    const actor = menu.actor ?? menu.box ?? menu;
    if (!actor) {
      return;
    }

    const effectName = `${this.uuid}-${targetName}`;
    if (actor.get_effect(effectName)) {
      return;
    }

    const blurEffect = new Shell.BlurEffect();
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

    actor.add_effect_with_name(effectName, blurEffect);
    actor.add_style_class_name('mactahoe-glass-blur');

    this._blurredActors.push({ actor, name: effectName });
  }
}
