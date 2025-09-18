import prisma from "../generated/prisma/client"; // adjust path

// export async function dispatchBooking(bookingId: string) {
//   // 1. Fetch booking with its driver + packages
//   const booking = await prisma.booking.findUnique({
//     where: { id: bookingId },
//     include: {
//       packages: true,
//     },
//   });

//   if (!booking) throw new Error("Booking not found");

//   // 2. Calculate total package requirements
//   const totalWeight = booking.packages.reduce((sum, p) => sum + p.weightKg, 0);
//   const totalVolume = booking.packages.reduce(
//     (sum, p) => sum + p.volumeLiters,
//     0
//   );
//   const fragile = booking.packages.some((p) => p.fragile);

//   // 3. Fetch available vehicles for the driver
//   const vehicles = await prisma.vehicle.findMany({
//     where: {
//       driverId: booking.driverId,
//       isActive: true,
//     },
//   });

//   if (!vehicles.length) throw new Error("No active vehicles for this driver");

//   // 4. Filter vehicles that meet package requirements
//   const suitableVehicles = vehicles.filter((v) => {
//     const fitsCapacity = v.capacityKg >= totalWeight && v.capacityVol >= totalVolume;
//     const fitsFragile = !fragile || v.vehicleType !== "BIKE"; // Example rule
//     return fitsCapacity && fitsFragile;
//   });

//   if (!suitableVehicles.length) throw new Error("No suitable vehicle found");

//   // 5. Pick the "best" vehicle (example: smallest capacity that fits)
//   const chosenVehicle = suitableVehicles.sort(
//     (a, b) => a.capacityKg - b.capacityKg
//   )[0];

//   // 6. Update booking with chosen vehicle
//   await prisma.booking.update({
//     where: { id: bookingId },
//     data: {
//       vehicleId: chosenVehicle.id,
//       status: "ASSIGNED",
//     },
//   });

//   return { bookingId, vehicle: chosenVehicle };
// }


// const newBooking = await prisma.booking.create({
//   data: {
//     driverId: "driver-123",
//     packages: {
//       create: [
//         { weightKg: 20, volumeLiters: 30 },
//         { weightKg: 15, volumeLiters: 10, fragile: true },
//       ],
//     },
//   },
// });

// const result = await dispatchBooking(newBooking.id);
// console.log("Booking assigned:", result);
