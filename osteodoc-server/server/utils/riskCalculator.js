/**
 * OsteoDoc – Risikoberechnung nach DVO-Leitlinie 2023
 *
 * Berechnet das Frakturrisiko basierend auf:
 * - Alter und Geschlecht
 * - DXA T-Scores (Hüfte, LWS, Schenkelhals)
 * - TBS (Trabecular Bone Score)
 * - Klinische Risikofaktoren mit relativem Risiko (RR)
 * - Medikamentöse Risikofaktoren
 * - Sekundäre Osteoporose-Ursachen
 */

/**
 * Hauptfunktion zur Risikoberechnung.
 * @param {Object} data - Befunddaten aus dem Fragebogen
 * @returns {Object} Ergebnis mit Risikokategorie, Gesamtrisiko, Empfehlung
 */
function calculateRisk(data) {
  const {
    age,
    gender,
    // DXA-Werte
    tScoreHip,
    tScoreLumbar,
    tScoreFemoralNeck,
    tbs,
    // Risikofaktoren (Array von { name, relativeRisk })
    riskFactors = [],
    // Frakturen
    fractures = {},
    // Medikamente
    medications = {},
    // Sekundäre Ursachen
    secondaryCauses = [],
  } = data;

  // ─── Basis-RR nach Alter und T-Score ─────────────────────
  const lowestTScore = Math.min(
    tScoreHip != null ? tScoreHip : 0,
    tScoreLumbar != null ? tScoreLumbar : 0,
    tScoreFemoralNeck != null ? tScoreFemoralNeck : 0
  );

  let baseRR = 1.0;

  // T-Score-basiertes Risiko
  if (lowestTScore <= -4.0) {
    baseRR = 3.0;
  } else if (lowestTScore <= -3.5) {
    baseRR = 2.5;
  } else if (lowestTScore <= -3.0) {
    baseRR = 2.0;
  } else if (lowestTScore <= -2.5) {
    baseRR = 1.5;
  } else if (lowestTScore <= -2.0) {
    baseRR = 1.2;
  } else if (lowestTScore <= -1.5) {
    baseRR = 1.0;
  }

  // ─── TBS-Korrektur ──────────────────────────────────────
  let tbsAdjustment = 1.0;
  if (tbs != null) {
    if (tbs < 1.23) {
      tbsAdjustment = 1.5;
    } else if (tbs < 1.31) {
      tbsAdjustment = 1.2;
    }
  }

  // ─── Risikofaktoren multiplizieren ──────────────────────
  let clinicalRR = 1.0;
  const activeFactors = [];

  for (const factor of riskFactors) {
    if (factor.active && factor.relativeRisk) {
      clinicalRR *= factor.relativeRisk;
      activeFactors.push({
        name: factor.name,
        rr: factor.relativeRisk,
      });
    }
  }

  // ─── Frakturen ──────────────────────────────────────────
  let fractureRR = 1.0;
  if (fractures.multipleVertebral) {
    fractureRR = 3.0;
  } else if (fractures.singleVertebralGrade2or3) {
    fractureRR = 2.0;
  } else if (fractures.proximalFemur) {
    fractureRR = 2.0;
  } else if (fractures.singleVertebralGrade1) {
    fractureRR = 1.5;
  } else if (fractures.otherLowTrauma) {
    fractureRR = 1.5;
  }

  // ─── Medikamente ────────────────────────────────────────
  let medicationRR = 1.0;
  if (medications.glucocorticoidsHigh) {
    medicationRR *= 4.0;  // ≥7,5 mg
  } else if (medications.glucocorticoidsLow) {
    medicationRR *= 2.0;  // ≥2,5 mg
  }
  if (medications.aromataseInhibitors) medicationRR *= 1.5;
  if (medications.antiandrogens) medicationRR *= 1.5;
  if (medications.anticonvulsants) medicationRR *= 1.2;
  if (medications.ppiLongTerm) medicationRR *= 1.2;

  // ─── Sekundäre Ursachen ─────────────────────────────────
  let secondaryRR = 1.0;
  for (const cause of secondaryCauses) {
    if (cause.active && cause.relativeRisk) {
      secondaryRR *= cause.relativeRisk;
    }
  }

  // ─── Stürze, Immobilität, Lebensstil ───────────────────
  let lifestyleRR = 1.0;
  if (data.falls >= 2) lifestyleRR *= 1.5;
  if (data.immobile) lifestyleRR *= 1.5;
  if (data.smoking) lifestyleRR *= 1.2;
  if (data.bmi && data.bmi < 20) lifestyleRR *= 1.5;

  // ─── Gesamtrisiko berechnen ─────────────────────────────
  const totalRR = baseRR * tbsAdjustment * clinicalRR * fractureRR
                  * medicationRR * secondaryRR * lifestyleRR;

  // ─── Risikokategorie bestimmen ──────────────────────────
  let category, categoryLabel, color;
  if (totalRR >= 3.0) {
    category = 'very_high';
    categoryLabel = 'Sehr hoch';
    color = '#dc2626';
  } else if (totalRR >= 2.0) {
    category = 'high';
    categoryLabel = 'Hoch';
    color = '#ea580c';
  } else if (totalRR >= 1.5) {
    category = 'moderate';
    categoryLabel = 'Moderat';
    color = '#ca8a04';
  } else {
    category = 'low';
    categoryLabel = 'Niedrig';
    color = '#16a34a';
  }

  // ─── Therapieempfehlung ─────────────────────────────────
  let recommendation;
  if (category === 'very_high') {
    recommendation = 'Spezifische medikamentöse Osteoporose-Therapie dringend empfohlen. ' +
      'Basismaßnahmen (Calcium, Vitamin D, Bewegung) einleiten.';
  } else if (category === 'high') {
    recommendation = 'Spezifische medikamentöse Osteoporose-Therapie empfohlen. ' +
      'Basismaßnahmen einleiten. Kontrolle in 12 Monaten.';
  } else if (category === 'moderate') {
    recommendation = 'Basismaßnahmen empfohlen (Calcium, Vitamin D, Sturzprophylaxe). ' +
      'Reevaluation in 12-24 Monaten. Medikamentöse Therapie individuell abwägen.';
  } else {
    recommendation = 'Basismaßnahmen empfohlen. Reevaluation gemäß Risikoprofil.';
  }

  return {
    totalRR: Math.round(totalRR * 100) / 100,
    category,
    categoryLabel,
    color,
    recommendation,
    lowestTScore,
    details: {
      baseRR,
      tbsAdjustment,
      clinicalRR,
      fractureRR,
      medicationRR,
      secondaryRR,
      lifestyleRR,
    },
    activeFactors,
    calculatedAt: new Date().toISOString(),
  };
}

module.exports = { calculateRisk };
