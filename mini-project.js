const prompt = require("prompt-sync")();

const taxis = [
  { id: 1, position: 5, available: false, timeRemaining: 4, totalRides: 0 },
  { id: 2, position: 10, available: false, timeRemaining: 6, totalRides: 0 },
];

const requests = [
  { reqId: 1, position: 4, duration: 3, time: 2 },
  { reqId: 2, position: 3, duration: 6, time: 3 },
];

const queue = [];

const getClosestTaxi = (request) => {
  const availableTaxis = taxis.filter((taxi) => taxi.available);
  if (availableTaxis.length === 0) return null;

  const data = {
    closestTaxi: null,
    minDistance: Infinity,
  };

  for (const taxi of availableTaxis) {
    const distance = Math.abs(taxi.position - request.position);
    if (distance < data.minDistance) {
      data.minDistance = distance;
      data.closestTaxi = taxi;
    }
  }
  return data;
};

const simulateRides = (totalMinutes) => {
  for (let minute = 0; minute <= totalMinutes; minute++) {
    console.log(`-------- 🕒 Minute ${minute} -----------`);

    for (const taxi of taxis) {
      if (!taxi.available) {
        // Taxi already accepte course
        taxi.timeRemaining -= 1;
        if (taxi.timeRemaining <= 0) {
          taxi.available = true;
          taxi.timeRemaining = 0;
          console.log(
            `\n✅ Taxi ${taxi.id} finished ride and is now available!`
          );
        }
      }
    }

    for (const request of requests) {
      if (request.time === minute) {
        console.log(
          `\n🚖 New Request ${request.reqId} at position ${request.position}`
        );

        if (queue.length > 0) {
          queue.push(request);
          console.log(
            `\n⏳ All taxis busy → Request ${request.reqId} added to queue`
          );
        } else {
          const result = getClosestTaxi(request);
          if (result) {
            const { closestTaxi, minDistance } = getClosestTaxi(request);
            closestTaxi.position = request.position;
            closestTaxi.available = false;
            closestTaxi.timeRemaining = request.duration;
            closestTaxi.totalRides += 1;
            console.log(
              `\n→ Taxi ${closestTaxi.id} assigned (distance: ${minDistance}, duration: ${request.duration})`
            );
          } else {
            queue.push(request);
            console.log(
              `\n⏳ All taxis busy → Request ${request.reqId} added to queue`
            );
          }
        }
      }
    }

    for (let i = 0; i < queue.length; i++) {
      const req = queue[i];
      const result = getClosestTaxi(req);
      if (result) {
        const { closestTaxi, minDistance } = getClosestTaxi(req);
        closestTaxi.available = false;
        closestTaxi.position = req.position;
        closestTaxi.timeRemaining = req.duration;
        closestTaxi.totalRides += 1;
        console.log(
          `\n→ Taxi ${closestTaxi.id} assigned (distance: ${minDistance}, duration: ${req.duration})`
        );
        queue.splice(i, 1);
        i--;
      }
    }
    console.log(`\n`);
  }
};

simulateRides(20);

console.log("\nAll rides completed.");
console.log("\n------------------- Final Report -----------------");

const totalRides = [];

for (let i = 0; i < taxis.length; i++) {
  console.log(
    `\ntaxi ${taxis[i].id}: ${taxis[i].totalRides} rides, position ${taxis[i].position}`
  );
  totalRides.push(taxis[i].totalRides);
}

const sumTotalRides = totalRides.reduce((acc, curr) => acc + curr, 0);
console.log(`\nTotal rides: ${sumTotalRides}`);
