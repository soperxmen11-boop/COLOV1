Mascot FX integrated
--------------------
- Added CSS animations (.kp-correct pop, .kp-wrong shake) and confetti.
- Added JS helper window.kpFX.correct(el)/wrong(el) in ui/game.js.
- Heuristic injection tries to call effects when mascot answers are evaluated.
If your mascot handler uses different variable names (not 'isCorrect'), add one line where you decide the result:
    kpFX.correct(targetEl);  // for correct picks
    kpFX.wrong(targetEl);    // for wrong picks