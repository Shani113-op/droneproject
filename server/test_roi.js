// test script

async function test() {
  const res = await fetch('http://localhost:5001/api/roi/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      annualCalls: 10000,
      droneFirstShare: 9.6,
      droneClearanceRate: 25,
      numberOfDrones: 1,
      averagePatrolCostPerCall: 45
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
