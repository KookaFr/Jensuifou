/* Coquilles — petits sons synthétisés (aucun fichier audio à charger). */
(function () {
  'use strict';
  const CQ = window.CQ;

  CQ.Son = {
    actif: CQ.stock.lire('son', true),
    ctx: null,

    // À appeler depuis un geste de l'utilisateur : les navigateurs l'exigent.
    reveiller() {
      if (!this.ctx) {
        try {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          this.ctx = Ctx ? new Ctx() : null;
        } catch (e) {
          this.ctx = null;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    },

    basculer() {
      this.actif = !this.actif;
      CQ.stock.ecrire('son', this.actif);
      return this.actif;
    },

    note(freq, debut, duree, type, volume, glisse) {
      const c = this.ctx, t = c.currentTime + debut;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (glisse) o.frequency.exponentialRampToValueAtTime(glisse, t + duree);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(volume, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
      o.connect(g);
      g.connect(c.destination);
      o.start(t);
      o.stop(t + duree + 0.02);
    },

    jouer(nom, serie) {
      if (!this.actif || !this.ctx) return;
      try {
        if (nom === 'trouve') {
          // La note monte avec la série : on entend qu'on est en forme.
          const base = 523 * Math.pow(1.0595, Math.min(serie || 1, 12) - 1);
          this.note(base, 0, 0.09, 'triangle', 0.12);
          this.note(base * 1.5, 0.06, 0.14, 'triangle', 0.1);
        } else if (nom === 'zele') {
          this.note(190, 0, 0.16, 'square', 0.035, 120);
        } else if (nom === 'rate') {
          this.note(220, 0, 0.38, 'sawtooth', 0.05, 70);
        } else if (nom === 'imprime') {
          this.note(1500, 0, 0.03, 'square', 0.012);
        } else if (nom === 'tampon') {
          this.note(110, 0, 0.12, 'sine', 0.25, 50);
        } else if (nom === 'fin') {
          [523, 659, 784].forEach((f, i) => this.note(f, i * 0.12, 0.2, 'triangle', 0.1));
        }
      } catch (e) { /* son indisponible : le jeu continue */ }
    },
  };

  CQ.vibrer = function (motif) {
    try {
      if (CQ.Son.actif && navigator.vibrate) navigator.vibrate(motif);
    } catch (e) { /* vibration refusée */ }
  };
})();
