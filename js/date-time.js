export function getDateDifference(date1, date2) {
  // Calculate absolute difference in milliseconds
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  
  // Convert to total seconds
  let totalSeconds = Math.floor(diffMs / 1000);
  
  const result = [];
  
  // Define time units in descending order (seconds to larger units)
  const units = [
    { name: 'hours', seconds: 3600 },      // 60 * 60
    { name: 'mins', seconds: 60 },
    { name: 'seconds', seconds: 1 }
  ];
  
  // Calculate each unit
  for (const unit of units) {
    const count = Math.floor(totalSeconds / unit.seconds);
    
    if (count > 0) {
      result.push({
        number: count,
        unit: unit.name
      });
      
      // Subtract the seconds we've accounted for
      totalSeconds -= count * unit.seconds;
    }
  }
  
  // If no difference (same dates), return 0 seconds
  if (result.length === 0) {
    result.push({
      number: 0,
      unit: 'seconds'
    });
  }
  
  return result;
}