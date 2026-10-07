/*
 * Schilly's Catering — menu data
 * ------------------------------------------------------------------
 * This is the ONE file to edit when the menu changes. The page builds
 * the menu, the category jump-links, the dietary filters and the quote
 * builder from this list automatically.
 *
 * Fields per item:
 *   name   – required
 *   desc   – short, plain description (one sentence)
 *   price  – optional string, e.g. "$18 / person" or "Market price".
 *            Leave it out and the page shows "Priced with your quote".
 *   unit   – optional serving note, e.g. "Min. 25 guests"
 *   tags   – any of: "gf" (gluten-free), "v" (vegetarian), "vg" (vegan),
 *            "df" (dairy-free), "popular", "spicy"
 *
 * IMPORTANT: MENU_IS_DRAFT = true shows a notice on the menu that items are
 * being confirmed. The items below are a starting draft built around the
 * services Schilly's advertises (BBQ, pig roasts, lobster bakes, events).
 * Replace them with the current catering menu, then set this to false.
 */
window.MENU_IS_DRAFT = true;

window.MENU = [
  {
    id: "packages",
    title: "Event Packages",
    blurb: "Complete meals for a crowd. The easiest place to start.",
    items: [
      { name: "Maine Lobster Bake", desc: "Whole Maine lobster, steamers, corn on the cob, red potatoes and drawn butter, cooked on site.", unit: "Min. 25 guests", tags: ["gf", "popular"] },
      { name: "Whole Pig Roast", desc: "A whole hog slow-roasted on site and pulled to order, with two sides and rolls.", unit: "Min. 50 guests", tags: ["gf", "df", "popular"] },
      { name: "Backyard BBQ", desc: "Choose two smoked meats and three sides. Our most flexible party menu.", unit: "Min. 20 guests", tags: ["popular"] },
      { name: "Corporate Lunch", desc: "Drop-off or staffed buffet for the office, with vegetarian and gluten-free options built in.", unit: "Min. 15 guests", tags: [] }
    ]
  },
  {
    id: "smokehouse",
    title: "From the Smoker",
    blurb: "Smoked low and slow, often on site the morning of your event.",
    items: [
      { name: "Pulled Pork", desc: "Pork shoulder smoked for hours, served with house BBQ sauce on the side.", tags: ["gf", "df", "popular"] },
      { name: "Smoked Brisket", desc: "Sliced beef brisket with a peppery bark.", tags: ["gf", "df"] },
      { name: "BBQ Chicken", desc: "Bone-in chicken, smoked then finished on the grill.", tags: ["gf", "df"] },
      { name: "Smoked Sausage", desc: "Grilled sausage links with peppers and onions.", tags: ["gf", "df"] },
      { name: "Ribs", desc: "St. Louis–style pork ribs, dry rub or sauced.", tags: ["gf", "df"] }
    ]
  },
  {
    id: "appetizers",
    title: "Appetizers",
    blurb: "Passed or stationed, for cocktail hours and grazing.",
    items: [
      { name: "Lobster Roll Sliders", desc: "Maine lobster salad on mini buttered rolls.", tags: ["popular"] },
      { name: "Caprese Skewers", desc: "Mozzarella, cherry tomato and basil with balsamic glaze.", tags: ["gf", "v"] },
      { name: "Pulled Pork Sliders", desc: "Mini rolls with slaw and pickles.", tags: [] },
      { name: "Seasonal Crudité", desc: "Fresh vegetables with herb dip.", tags: ["gf", "v"] },
      { name: "Cheese & Charcuterie Board", desc: "Local cheeses, cured meats, crackers and fruit.", tags: [] }
    ]
  },
  {
    id: "sides",
    title: "Sides & Salads",
    blurb: "Pick three with any BBQ package. Also available à la carte.",
    items: [
      { name: "Mac & Cheese", desc: "Baked, with a crispy top.", tags: ["v", "popular"] },
      { name: "Baked Beans", desc: "Slow-cooked New England style.", tags: ["gf", "df"] },
      { name: "Coleslaw", desc: "Creamy and crunchy.", tags: ["gf", "v"] },
      { name: "Potato Salad", desc: "Classic red-skin potato salad.", tags: ["gf", "v"] },
      { name: "Corn on the Cob", desc: "Buttered sweet corn, in season.", tags: ["gf", "v"] },
      { name: "Garden Salad", desc: "Mixed greens with house vinaigrette.", tags: ["gf", "vg", "df"] },
      { name: "Pasta Salad", desc: "Tri-color pasta with vegetables and Italian dressing.", tags: ["v", "df"] },
      { name: "Cornbread", desc: "With honey butter.", tags: ["v"] }
    ]
  },
  {
    id: "plant-based",
    title: "Vegetarian & Vegan Mains",
    blurb: "So everyone at the table gets a real plate.",
    items: [
      { name: "Grilled Vegetable Platter", desc: "Seasonal vegetables grilled with olive oil and herbs.", tags: ["gf", "vg", "df"] },
      { name: "BBQ Jackfruit", desc: "Pulled-style jackfruit in house BBQ sauce.", tags: ["gf", "vg", "df"] },
      { name: "Veggie Burgers", desc: "Grilled to order, with all the fixings.", tags: ["v"] }
    ]
  },
  {
    id: "desserts",
    title: "Desserts",
    blurb: "Finish sweet.",
    items: [
      { name: "Whoopie Pies", desc: "A Maine classic.", tags: ["v", "popular"] },
      { name: "Blueberry Cobbler", desc: "Maine blueberries under a buttery crumble.", tags: ["v"] },
      { name: "Brownies & Cookies", desc: "An assorted tray.", tags: ["v"] }
    ]
  }
];

window.TAGS = {
  gf: { label: "Gluten-free", short: "GF" },
  v: { label: "Vegetarian", short: "V" },
  vg: { label: "Vegan", short: "VG" },
  df: { label: "Dairy-free", short: "DF" },
  popular: { label: "Crowd favorite", short: "★" },
  spicy: { label: "Spicy", short: "🌶" }
};
