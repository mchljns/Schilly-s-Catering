/*
 * Schilly's Take Out & Catering Kitchen: menu data.
 *
 * Every word here comes from schillyscatering.com (/take-out-menu and /catering-menu,
 * October 2026), cut but never reworded (brand/07-copy.md). When the menu changes, paste the
 * new wording here and run `npm run build`. `npm run check` fails if any text is missing
 * from brand/source/.
 *
 *   title  section heading, as printed on the menu
 *   notes  lines printed under the heading
 *   items  [name, price?, detail?]  price and detail are optional
 */
export const MENUS = {
  takeout: {
    id: "take-out-menu",
    label: "TAKE OUT & FAMILY MEALS",
    sub: "Smoked favorites • Homemade sides • Family-size portions",
    title: "TAKE OUT KITCHEN MENU",
    sections: [
      {
        title: "BBQ PLATES",
        notes: ["All plates served with Mac & Cheese, BBQ Beans, Coleslaw & Cornbread."],
        items: [["Pulled Chicken", "$28"], ["Pulled Pork", "$28"], ["Sliced Brisket", "$30"], ["Three Meat", "$35"]]
      },
      {
        title: "WHITE CHEDDAR MAC & CHEESE",
        items: [["Mac & Cheese Bowl", "$10"], ["Pulled Pork Mac & Cheese", "$14"], ["Pulled Chicken Mac & Cheese", "$14"], ["Brisket Mac & Cheese", "$17"]]
      },
      {
        title: "FAMILY SIZE PORTIONS",
        notes: ["(4 Servings each)"],
        items: [["Mac & Cheese", "$30"], ["Pulled Pork", "$35"], ["Pulled Chicken", "$35"], ["Brisket", "$40"], ["Baked Beans", "$12"], ["Coleslaw", "$10"]]
      },
      {
        title: "SANDWICHES",
        items: [
          ["BBQ Beef Brisket Sandwich", "$17"], ["BBQ Pulled Chicken Sandwich", "$14"], ["BBQ Pulled Pork Sandwich", "$14"],
          ["Add Coleslaw to any Sandwich", "$2"],
          ["Chicken Salad Sandwich", "$9"], ["Chicken Salad Wrap", "$9"], ["Peanut Butter & Jelly", "$5"], ["Grilled Cheese", "$7"]
        ]
      },
      {
        title: "SPECIALTY ITEMS",
        items: [["Black Bean Veggie Burger Homemade GF*", "$13", "served with Lettuce & Tomato"], ["Upgrade to GF* Udi’s Bun", "$3"]]
      },
      {
        title: "SPECIALTY BEEF HOT DOGS",
        notes: ["Choice of Red or Brown"],
        items: [["Fair Dog “Pulled Pork & Coleslaw”", "$11"], ["Mac & Cheese Dog", "$9"], ["BLT Dog", "$8"], ["Hot Dog Single", "$5"], ["Twin", "$8"], ["1 Hot Dog Meal with Soda & Chips", "$9"]]
      },
      {
        title: "SIDES",
        items: [
          ["White Cheddar Mac & Cheese", "$7"], ["New England Clam Chowder", "$8"], ["BBQ Baked Beans", "$4"], ["Potato Salad", "$4"],
          ["Pasta Salad", "$4"], ["Coleslaw", "$3"], ["Chips", "$2"], ["Cornbread (Plain or Jalapeño)", "$5"]
        ]
      },
      {
        title: "DESSERT",
        items: [["Whoopie Pie", "$4"], ["Blueberry Cake", "$7"], ["Jumbo Cookies", "$4"]]
      }
    ],
    footnotes: [
      "Prices include Maine State Sales Tax.",
      "Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.",
      "*Prices are subject to change. In-store pricing is the standard."
    ]
  },

  catering: {
    id: "catering-menu",
    label: "CATERING MENU",
    sub: "Weddings • Backyard BBQs • Corporate Events • Private Parties",
    title: "CATERING MENU",
    sections: [
      {
        group: "LUNCH MENU",
        title: "BOXED LUNCH",
        notes: ["Lunch Boxes or Buffet options", "Includes a side and beverage"],
        items: [["Hamburger or Cheeseburger"], ["Hot Dog"], ["Meatball Sub"], ["Tuna Salad"], ["Chicken Salad"], ["Egg Salad"], ["Sliced Turkey or Ham"], ["BLT"]]
      },
      {
        title: "ELEVATED BOXED LUNCHES",
        notes: ["Includes a side, fresh fruit, and beverage.", "Served on Sourdough, Brioche Roll, Whole Wheat Wrap, or Artisan Bread."],
        items: [
          ["Sliced Roast Brisket"], ["BBQ Pulled Pork or Chicken"], ["Grilled Chicken"], ["Cranberry Walnut Chicken Salad"],
          ["Turkey Bacon Club"], ["Thanksgiving Turkey Club"], ["Black Bean Burger *GF & Vegan"], ["Lobster Roll", "+ Market Cost"]
        ]
      },
      {
        title: "Boxed Salads",
        notes: ["Includes a side and beverage."],
        items: [
          ["Garden Salad"], ["Caesar Salad"], ["Cobb Salad"], ["Italian Pasta Salad"], ["Autumn Harvest Salad"],
          ["Balsamic Spinach & Beets Salad"], ["Caprese Pasta Salad"], ["BLT Pasta Salad"]
        ]
      },
      {
        title: "SOUPS & CROCK FAVORITES",
        items: [
          ["Cream of Tomato"], ["Chicken Noodle"], ["Hearty Beef & Vegetable"], ["Beef & Bean Chili"],
          ["White Cheddar Mac & Cheese"], ["Fish and Clam Chowders"], ["New England Corn Chowder"], ["White Chicken Chili"]
        ]
      },
      {
        title: "DESSERTS",
        items: [
          ["Brownies"], ["Chocolate Chip Cookies"], ["Mini Whoopie Pie"], ["Oatmeal Cream Pie"],
          ["Oatmeal Raisin Cookies"], ["Peanut Butter Cookie"], ["Strawberry Shortcake"], ["Maine Blueberry Cake"]
        ]
      },
      {
        title: "PARTY PLATTERS, BOARDS & GRAZES",
        notes: ["Platters serve approximately 10–12 people."],
        items: [
          ["CHARCUTERIE BOARD", "", "Assortment of fine meats and cheeses, dried and fresh fruits, nuts, olives, assorted crackers with jams or honey."],
          ["DELI PLATTER", "", "Assorted deli meats with choice of ham, turkey, roast beef and Genoa salami, American and Swiss cheeses, with choice of breads."],
          ["CHEESE PLATTER", "", "Mozzarella, Swiss, yellow cheddar and pepper jack served with artisan crackers."],
          ["FINGER SANDWICHES", "", "Chicken, ham, tuna, seafood and egg salad."],
          ["ITALIAN FINGER SANDWICHES", "", "Made with ham, turkey, or roast beef with American cheese, onion, pepper, tomato, pickle, and olives."],
          ["SLIDERS", "", "Sliced Brisket • BBQ Chicken • Pulled Pork • Cheeseburger"],
          ["CHICKEN WINGS", "", "Seasoned chicken wings with Ranch & Blue Cheese, carrots & celery."],
          ["CHICKEN SATAY OR BEEF SKEWERS", "", "Grilled or smoked with dipping sauce."],
          ["VEGETABLE PLATTER", "", "Seasonal vegetables served with dips."],
          ["HUMMUS PLATTER", "", "Hummus and Naan served with seasonal vegetables."],
          ["FRESH FRUIT SALAD", "", "Watermelon, cantaloupe, honeydew, green and red grapes, kiwi, and orange slices."],
          ["SHRIMP COCKTAIL", "", "Large shrimp on a bed of lettuce with cocktail sauce and lemon slices."],
          ["CAPRESE SALAD BITES", "", "Fresh tomato, mozzarella, and basil with balsamic glaze."],
          ["BALSAMIC BLUEBERRY JAM or RED PEPPER JELLY", "", "Served over Whipped OR Smoked Cream Cheese spread with assorted crackers."],
          ["BUFFALO CHICKEN DIP", "", "Served with tortilla chips and fresh carrot and celery sticks."],
          ["ANTIPASTO SKEWERS", "", "Genoa salami, soppressata, mozzarella balls, cheese tortellini, pepperoncini peppers, artichoke hearts, Kalamata or black olives, and fresh basil dressed with Greek dressing."],
          ["MEXICAN STREET CORN DIP", "", "Served with tortilla chips."],
          ["SPINACH & ARTICHOKE DIP", "", "Served warmed OR cold with tortilla chips and carrot sticks."],
          ["LETTUCE & TOMATO PLATTER", "", "Green leaf and romaine lettuce with sliced tomatoes and red onions."]
        ]
      }
    ],
    closing: {
      text: "Give us a call."
    }
  }
};
