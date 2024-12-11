// Back end function library for the api

// // load json data into memory
// async function loadData(path: String = "./data.json"): String {
//   try {
//     if (path) {
//       const file = await Deno.readFile(path);
//       return file;
//     } else {
//       throw new Error("Something went wrong");
//     }
//   } catch (err) {
//     console.log("could not load json data: ", err);
//     Deno.exit(1);
//   }
// }

// roll any of the standard dice
function rollDice(dice: number = 20): number {
  // valid dice
  const valid = [4, 6, 8, 10, 12, 20, 100];

  if (valid.includes(Number(dice))) {
    const n = Math.floor(Math.random() * dice + 1) + 1;

    return n;
  } else {
    return 1;
  }
}

export { rollDice };
