
export interface PlannerInput {
  currentAge: number;
  currentSavings: number;
  annualContribution: number;
  annualReturn: number;
  desiredAnnualIncome: number;
  inflationRate: number;
}

export interface PlannerOutput {
  retirementAge: number;
  requiredMonthlySavings: number;
  nestEgg: number;
  canRetire: boolean;
  projections: { year: number; age: number; savings: number }[];
}

const MAX_AGE = 100;
const WITHDRAWAL_RATE = 0.04; // 4% rule

export const calculateRetirementPlan = (input: PlannerInput): PlannerOutput => {
  const {
    currentAge,
    currentSavings,
    annualContribution,
    annualReturn,
    desiredAnnualIncome,
    inflationRate,
  } = input;

  let savings = currentSavings;
  const projections: { year: number; age: number; savings: number }[] = [{ year: 0, age: currentAge, savings }];
  
  for (let age = currentAge + 1; age <= MAX_AGE; age++) {
    // Grow savings with annual return
    savings *= (1 + annualReturn / 100);
    // Add new contribution
    savings += annualContribution;

    projections.push({ year: age - currentAge, age: age, savings });

    // Calculate the nest egg needed at this age, adjusted for inflation
    const yearsToProject = age - currentAge;
    const inflationAdjustedIncome = desiredAnnualIncome * Math.pow(1 + inflationRate / 100, yearsToProject);
    const requiredNestEgg = inflationAdjustedIncome / WITHDRAWAL_RATE;

    if (savings >= requiredNestEgg) {
      return {
        retirementAge: age,
        requiredMonthlySavings: calculateRequiredMonthlySavings(input, age),
        nestEgg: requiredNestEgg,
        canRetire: true,
        projections,
      };
    }
  }
  
  // If loop finishes, retirement is not possible by MAX_AGE with current contributions
  return {
    retirementAge: MAX_AGE,
    requiredMonthlySavings: calculateRequiredMonthlySavings(input, 65), // Calculate for a standard age
    nestEgg: 0,
    canRetire: false,
    projections,
  };
};


const calculateRequiredMonthlySavings = (input: PlannerInput, targetRetirementAge: number): number => {
    const {
        currentAge,
        currentSavings,
        annualReturn,
        desiredAnnualIncome,
        inflationRate
    } = input;

    if (targetRetirementAge <= currentAge) return 0;

    const yearsToSave = targetRetirementAge - currentAge;
    const inflationAdjustedIncome = desiredAnnualIncome * Math.pow(1 + inflationRate / 100, yearsToSave);
    const targetNestEgg = inflationAdjustedIncome / WITHDRAWAL_RATE;
    const r = annualReturn / 100;

    // Calculate future value of current savings
    const fvOfCurrentSavings = currentSavings * Math.pow(1 + r, yearsToSave);

    const shortfall = targetNestEgg - fvOfCurrentSavings;

    if (shortfall <= 0) return 0;

    // Calculate required annual contribution using annuity formula solved for payment
    // P = FV * [r / ((1 + r)^n - 1)]
    const denominator = Math.pow(1 + r, yearsToSave) - 1;
    if (denominator === 0) return Infinity; 
    
    const requiredAnnualContribution = shortfall * (r / denominator);
    
    return requiredAnnualContribution > 0 ? requiredAnnualContribution / 12 : 0;
};
   