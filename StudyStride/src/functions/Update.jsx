const Update = () => {
  return (
    <div>
      
    </div>
  )
};

// Decrement all non-health bars by 1 (to a minimum of 0)
export function decrementBars({ energy, thirst, hunger, sanity }) {
  return {
    energy: Math.max(energy - 1, 0),
    thirst: Math.max(thirst - 1, 0),
    hunger: Math.max(hunger - 1, 0),
    sanity: Math.max(sanity - 1, 0),
  };
}

// Calculate health penalty: number of non-health bars at zero
export function getHealthPenalty({ energy, thirst, hunger, sanity }) {
  let penalty = 0;
  if (energy === 0) penalty++;
  if (thirst === 0) penalty++;
  if (hunger === 0) penalty++;
  if (sanity === 0) penalty++;
  return penalty;
}

export default Update
