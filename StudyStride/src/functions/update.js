
// Decrement all non-health bars by 1 (to a minimum of 0)
export function decrementBars({ energy, thirst, hunger }) {
  const newEnergy = energy > 1 ? energy - 1 : 1;
  const newThirst = thirst > 1 ? thirst - 1 : 1;
  const newHunger = hunger > 1 ? hunger - 1 : 1;

  return {
    energy: newEnergy,
    thirst: newThirst,
    hunger: newHunger
  };
}

// Calculate health penalty: number of non-health bars at zero
export function getHealthPenalty({ energy, thirst, hunger }) {
  let penalty = 0;
  
  if (energy === 1) penalty += 1;
  if (thirst === 1) penalty += 1;
  if (hunger === 1) penalty += 1;
  
  return penalty;
}
