import { DateTime } from "luxon";

const breaches = await getBreaches();

let diffDays = 0;

console.log("# HIBP DATE DIFFS\n");

console.log("NAME | BREACH DATE | ADDED DATE | DATE DIFF\n:----|:----:|:----:|----:|");
for (const b of breaches) {
  const breachAdded = new Date(b.AddedDate);
  const breachDate = new Date(b.BreachDate);

  const bA = DateTime.fromJSDate(breachAdded);
  const bD = DateTime.fromJSDate(breachDate);

  diffDays += bA.diff(bD, 'days').days;
  console.log(`[%s](%s) | %s | %s | %s`,
    b.Title,
    `https://monitor.firefox.com/breach-details/${b.Name}`,
    breachDate.toLocaleDateString(),
    breachAdded.toLocaleDateString(),
    bD.toRelative({base: bA, unit: ["years", "months", "days"], round: false, style: "short"}).replace(/\sago$/, ""),
  );
}

console.log(`\n\nAVG DATE DIFF: ${Number(diffDays/breaches.length).toFixed(2)} days`);


async function getBreaches(limit=Infinity) {
  const res = await fetch("https://haveibeenpwned.com/api/v3/breaches");
  const breaches = await res.json();
  const sortFn = (key = "AddedDate") => {
    return (a, b) => Date.parse(b[key]) - Date.parse(a[key]);
  };
  return breaches.sort(sortFn("AddedDate")).slice(0, limit);
}
