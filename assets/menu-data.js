/*
 * Schilly's Take Out & Catering Kitchen — menu data
 * ------------------------------------------------------------------
 * The ONE file to edit when a menu changes. The page builds both menus,
 * the category jump-links, search and the catering inquiry list from it.
 *
 * Item fields:
 *   name   – required
 *   desc   – optional short description
 *   price  – optional, e.g. "$14" or "Market price"
 *   note   – optional small print, e.g. "Upgrade to GF Udi's bun +$3"
 *   tags   – optional: "gf" (gluten-free), "vg" (vegan), "v" (vegetarian)
 *
 * Source: schillyscatering.com/take-out-menu and /catering-menu (Oct 2026).
 */

window.TAGS = {
  gf: { label: "Gluten-free", short: "GF" },
  vg: { label: "Vegan", short: "Vegan" },
  v: { label: "Vegetarian", short: "V" }
};

window.MENUS = {
  takeout: {
    title: "Take Out Menu",
    intro: "Smoked low and slow, homemade sides, family-size portions. Open Wednesday–Sunday, 11am–6pm.",
    footnotes: [
      "Prices include Maine State Sales Tax.",
      "Prices are subject to change. In-store pricing is the standard.",
      "Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness."
    ],
    categories: [
      {
        id: "bbq-plates",
        title: "BBQ Plates",
        blurb: "Every plate comes with mac & cheese, BBQ beans, coleslaw and cornbread.",
        items: [
          { name: "Pulled Chicken", price: "$28" },
          { name: "Pulled Pork", price: "$28" },
          { name: "Sliced Brisket", price: "$30" },
          { name: "Three Meat", price: "$35" }
        ]
      },
      {
        id: "mac",
        title: "White Cheddar Mac & Cheese",
        items: [
          { name: "Mac & Cheese Bowl", price: "$10" },
          { name: "Pulled Pork Mac & Cheese", price: "$14" },
          { name: "Pulled Chicken Mac & Cheese", price: "$14" },
          { name: "Brisket Mac & Cheese", price: "$17" }
        ]
      },
      {
        id: "family",
        title: "Family Size Portions",
        blurb: "Each feeds about 4.",
        items: [
          { name: "Mac & Cheese", price: "$30" },
          { name: "Pulled Pork", price: "$35" },
          { name: "Pulled Chicken", price: "$35" },
          { name: "Brisket", price: "$40" },
          { name: "Baked Beans", price: "$12" },
          { name: "Coleslaw", price: "$10" }
        ]
      },
      {
        id: "sandwiches",
        title: "Sandwiches",
        blurb: "Add coleslaw to any sandwich for $2.",
        items: [
          { name: "BBQ Beef Brisket Sandwich", price: "$17" },
          { name: "BBQ Pulled Chicken Sandwich", price: "$14" },
          { name: "BBQ Pulled Pork Sandwich", price: "$14" },
          { name: "Chicken Salad Sandwich", price: "$9" },
          { name: "Chicken Salad Wrap", price: "$9" },
          { name: "Grilled Cheese", price: "$7" },
          { name: "Peanut Butter & Jelly", price: "$5" }
        ]
      },
      {
        id: "specialty",
        title: "Specialty Items",
        items: [
          { name: "Homemade Black Bean Veggie Burger", desc: "Served with lettuce and tomato.", price: "$13", note: "Upgrade to a gluten-free Udi's bun +$3", tags: ["gf"] }
        ]
      },
      {
        id: "hot-dogs",
        title: "Specialty Beef Hot Dogs",
        blurb: "Your choice of red or brown dog.",
        items: [
          { name: "Fair Dog", desc: "Topped with pulled pork and coleslaw.", price: "$11" },
          { name: "Mac & Cheese Dog", price: "$9" },
          { name: "BLT Dog", price: "$8" },
          { name: "Hot Dog Meal", desc: "One hot dog with soda and chips.", price: "$9" },
          { name: "Twin Dogs", price: "$8" },
          { name: "Single Hot Dog", price: "$5" }
        ]
      },
      {
        id: "sides",
        title: "Sides",
        items: [
          { name: "New England Clam Chowder", price: "$8" },
          { name: "White Cheddar Mac & Cheese", price: "$7" },
          { name: "Cornbread", desc: "Plain or jalapeño.", price: "$5" },
          { name: "BBQ Baked Beans", price: "$4" },
          { name: "Potato Salad", price: "$4" },
          { name: "Pasta Salad", price: "$4" },
          { name: "Coleslaw", price: "$3" },
          { name: "Chips", price: "$2" }
        ]
      },
      {
        id: "dessert",
        title: "Dessert",
        items: [
          { name: "Blueberry Cake", price: "$7" },
          { name: "Whoopie Pie", price: "$4" },
          { name: "Jumbo Cookie", price: "$4" }
        ]
      }
    ]
  },

  catering: {
    title: "Catering Menu",
    intro: "Homemade Maine flavor for weddings, backyard BBQs, corporate events and private parties. Catering is priced per event. Tap + Add on anything you like and it goes on your inquiry.",
    footnotes: [
      "More catering options are coming. Don't see what you want? Call us. We'd love to create something for your event."
    ],
    categories: [
      {
        id: "boxed",
        title: "Boxed Lunches",
        blurb: "Boxed or buffet. Each includes a side and a beverage.",
        items: [
          { name: "Hamburger or Cheeseburger" },
          { name: "Hot Dog" },
          { name: "Meatball Sub" },
          { name: "Tuna Salad" },
          { name: "Chicken Salad" },
          { name: "Egg Salad" },
          { name: "Sliced Turkey or Ham" },
          { name: "BLT" }
        ]
      },
      {
        id: "elevated",
        title: "Elevated Boxed Lunches",
        blurb: "Each includes a side, fresh fruit and a beverage. Served on sourdough, brioche roll, whole wheat wrap or artisan bread.",
        items: [
          { name: "Sliced Roast Brisket" },
          { name: "BBQ Pulled Pork or Chicken" },
          { name: "Grilled Chicken" },
          { name: "Cranberry Walnut Chicken Salad" },
          { name: "Turkey Bacon Club" },
          { name: "Thanksgiving Turkey Club" },
          { name: "Black Bean Burger", tags: ["gf", "vg"] },
          { name: "Lobster Roll", price: "Market price" }
        ]
      },
      {
        id: "salads",
        title: "Boxed Salads",
        blurb: "Each includes a side and a beverage.",
        items: [
          { name: "Garden Salad" },
          { name: "Caesar Salad" },
          { name: "Cobb Salad" },
          { name: "Italian Pasta Salad" },
          { name: "Autumn Harvest Salad" },
          { name: "Balsamic Spinach & Beets Salad" },
          { name: "Caprese Pasta Salad" },
          { name: "BLT Pasta Salad" }
        ]
      },
      {
        id: "soups",
        title: "Soups & Crock Favorites",
        items: [
          { name: "Cream of Tomato" },
          { name: "Chicken Noodle" },
          { name: "Hearty Beef & Vegetable" },
          { name: "Beef & Bean Chili" },
          { name: "White Chicken Chili" },
          { name: "White Cheddar Mac & Cheese" },
          { name: "Fish Chowder" },
          { name: "Clam Chowder" },
          { name: "New England Corn Chowder" }
        ]
      },
      {
        id: "platters",
        title: "Party Platters, Boards & Grazes",
        blurb: "Platters serve about 10–12 people.",
        items: [
          { name: "Charcuterie Board", desc: "Fine meats and cheeses, dried and fresh fruit, nuts, olives and crackers with jam or honey." },
          { name: "Deli Platter", desc: "Ham, turkey, roast beef and Genoa salami with American and Swiss, and your choice of breads." },
          { name: "Cheese Platter", desc: "Mozzarella, Swiss, yellow cheddar and pepper jack with artisan crackers." },
          { name: "Finger Sandwiches", desc: "Chicken, ham, tuna, seafood and egg salad." },
          { name: "Italian Finger Sandwiches", desc: "Ham, turkey or roast beef with American cheese, onion, pepper, tomato, pickle and olives." },
          { name: "Sliders", desc: "Sliced brisket, BBQ chicken, pulled pork or cheeseburger." },
          { name: "Chicken Wings", desc: "Seasoned wings with ranch and blue cheese, carrots and celery." },
          { name: "Chicken Satay or Beef Skewers", desc: "Grilled or smoked, with dipping sauce." },
          { name: "Shrimp Cocktail", desc: "Large shrimp on lettuce with cocktail sauce and lemon." },
          { name: "Antipasto Skewers", desc: "Genoa salami, soppressata, mozzarella, cheese tortellini, pepperoncini, artichoke hearts, olives and basil with Greek dressing." },
          { name: "Caprese Salad Bites", desc: "Tomato, mozzarella and basil with balsamic glaze." },
          { name: "Vegetable Platter", desc: "Seasonal vegetables with dips." },
          { name: "Hummus Platter", desc: "Hummus and naan with seasonal vegetables." },
          { name: "Fresh Fruit Salad", desc: "Watermelon, cantaloupe, honeydew, red and green grapes, kiwi and orange." },
          { name: "Lettuce & Tomato Platter", desc: "Green leaf and romaine with sliced tomatoes and red onion." }
        ]
      },
      {
        id: "dips",
        title: "Dips & Spreads",
        blurb: "Platters serve about 10–12 people.",
        items: [
          { name: "Balsamic Blueberry Jam or Red Pepper Jelly", desc: "Over whipped or smoked cream cheese, with assorted crackers." },
          { name: "Buffalo Chicken Dip", desc: "With tortilla chips, carrot and celery sticks." },
          { name: "Spinach & Artichoke Dip", desc: "Warm or cold, with tortilla chips and carrot sticks." },
          { name: "Mexican Street Corn Dip", desc: "With tortilla chips." }
        ]
      },
      {
        id: "desserts",
        title: "Desserts",
        items: [
          { name: "Brownies" },
          { name: "Chocolate Chip Cookies" },
          { name: "Oatmeal Raisin Cookies" },
          { name: "Peanut Butter Cookies" },
          { name: "Mini Whoopie Pies" },
          { name: "Oatmeal Cream Pies" },
          { name: "Strawberry Shortcake" },
          { name: "Maine Blueberry Cake" }
        ]
      }
    ]
  }
};
