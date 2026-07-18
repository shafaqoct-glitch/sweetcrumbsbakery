// Mock Data for Sweet Crumbs Bakery (Loaded globally to allow direct file:/// access)

window.bakeryCategories = [
  { id: 'all', name: 'All Products', icon: 'fa-birthday-cake' },
  { id: 'birthday-cakes', name: 'Birthday Cakes', icon: 'fa-cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400' },
  { id: 'wedding-cakes', name: 'Wedding Cakes', icon: 'fa-birthday-cake', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400' },
  { id: 'chocolate-cakes', name: 'Chocolate Cakes', icon: 'fa-cookie-bite', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400' },
  { id: 'cupcakes', name: 'Cupcakes', icon: 'fa-cookie', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=400' },
  { id: 'cookies', name: 'Cookies', icon: 'fa-cookie-bite', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400' },
  { id: 'brownies', name: 'Brownies', icon: 'fa-bread-slice', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400' },
  { id: 'pastries', name: 'Pastries', icon: 'fa-cheese', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' },
  { id: 'cheesecakes', name: 'Cheesecakes', icon: 'fa-cheese', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400' },
  { id: 'bread', name: 'Bread', icon: 'fa-bread-slice', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'desserts', name: 'Desserts', icon: 'fa-ice-cream', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400' }
];

window.bakeryProducts = [
  {
    id: 1,
    name: 'Chocolate Truffle Cake',
    category: 'chocolate-cakes',
    description: 'Decadent triple chocolate layers frosted with smooth dark chocolate ganache and finished with chocolate shavings.',
    price: 3500,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    tags: ['Best Seller', 'Chocolate'],
    inStock: true
  },
  {
    id: 2,
    name: 'Red Velvet Cake',
    category: 'birthday-cakes',
    description: 'Classic rich crimson velvet sponge cake layered with sweet cream cheese frosting and sprinkled with velvet crumbs.',
    price: 3200,
    rating: 4.8,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=600',
    tags: ['Best Seller', 'Classic'],
    inStock: true
  },
  {
    id: 3,
    name: 'Black Forest Cake',
    category: 'chocolate-cakes',
    description: 'Traditional German cake with whipped cream, sour cherries, chocolate sponge, and premium dark chocolate flakes.',
    price: 2800,
    rating: 4.7,
    reviewsCount: 74,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600',
    tags: ['Fruit', 'Chocolate'],
    inStock: true
  },
  {
    id: 4,
    name: 'Vanilla Bean Cake',
    category: 'birthday-cakes',
    description: 'Fluffy sponge made with organic Madagascan vanilla beans, filled with smooth vanilla custard and buttercream.',
    price: 2500,
    rating: 4.6,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=600',
    tags: ['Classic'],
    inStock: true
  },
  {
    id: 5,
    name: 'Pineapple Paradise Cake',
    category: 'birthday-cakes',
    description: 'Light sponge soaked in sweet pineapple juice, layered with fresh whipped cream and caramelized pineapple pieces.',
    price: 2600,
    rating: 4.5,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1582231374119-8414523c9288?auto=format&fit=crop&q=80&w=600',
    tags: ['Fruit', 'Light'],
    inStock: true
  },
  {
    id: 6,
    name: 'Blueberry Glaze Cheesecake',
    category: 'cheesecakes',
    description: 'Rich New York style cream cheese filling on a graham cracker crust, topped with fresh house-made sweet blueberry glaze.',
    price: 3800,
    rating: 4.9,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600',
    tags: ['Premium', 'Fruit'],
    inStock: true
  },
  {
    id: 7,
    name: 'Assorted Gourmet Cupcakes',
    category: 'cupcakes',
    description: 'A box of 6 cupcakes including double chocolate, red velvet, vanilla bean, salted caramel, lemon zest, and strawberry.',
    price: 1800,
    rating: 4.8,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600',
    tags: ['Assorted', 'Cupcakes'],
    inStock: true
  },
  {
    id: 8,
    name: 'Fudge Walnut Brownies',
    category: 'brownies',
    description: 'Super chewy fudge brownies packed with premium dark chocolate chips and toasted Californian walnut pieces.',
    price: 1500,
    rating: 4.7,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    tags: ['Nuts', 'Chocolate'],
    inStock: true
  },
  {
    id: 9,
    name: 'Chocolate Chip Cookies',
    category: 'cookies',
    description: 'Freshly baked giant chocolate chip cookies with crispy edges and soft, gooey centers. Box of 8.',
    price: 1200,
    rating: 4.9,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    tags: ['Best Seller', 'Cookies'],
    inStock: true
  },
  {
    id: 10,
    name: 'Glazed Belgian Donuts',
    category: 'desserts',
    description: 'Light and airy yeast-raised donuts dipped in a rich vanilla glaze. Box of 6.',
    price: 1000,
    rating: 4.6,
    reviewsCount: 43,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=600',
    tags: ['Glazed', 'Light'],
    inStock: true
  },
  {
    id: 11,
    name: 'Premium Parisian Macarons',
    category: 'desserts',
    description: 'Delicate French almond flour cookies filled with chocolate, pistachio, raspberry, lemon, and vanilla ganache. Box of 10.',
    price: 2400,
    rating: 4.8,
    reviewsCount: 132,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600',
    tags: ['Premium', 'Gift Box'],
    inStock: true
  },
  {
    id: 12,
    name: 'Artisanal Sourdough Bread',
    category: 'bread',
    description: 'Slow-fermented crusty sourdough loaf made with organic whole wheat flour and wild yeast starter.',
    price: 600,
    rating: 4.7,
    reviewsCount: 81,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    tags: ['Daily Baked', 'Sourdough'],
    inStock: true
  }
];

window.bakeryTestimonials = [
  {
    id: 1,
    name: 'Sophia Anderson',
    role: 'Event Planner',
    rating: 5,
    content: 'Amazing cakes and fast delivery. Sweet Crumbs is my go-to for corporate events. The chocolate truffle cake was absolute perfection!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 2,
    name: 'Liam Peterson',
    role: 'Father of two',
    rating: 5,
    content: 'The birthday cake was beautiful and delicious. Kids loved the customization option and the cake builder was super simple to use!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 3,
    name: 'Emma Sterling',
    role: 'Food Blogger',
    rating: 5,
    content: 'Best bakery in town! Their Parisian macarons taste identical to the ones I had in France. Extremely light, crispy, and creamy.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 4,
    name: 'Marcus & Chloe',
    role: 'Newlyweds',
    rating: 5,
    content: 'Highly recommended for weddings. The customized 3-tier red velvet cake made our special day spectacular. Professional service throughout.',
    avatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=100'
  }
];

window.bakeryFaqs = [
  {
    id: 1,
    question: 'Do you make custom cakes?',
    answer: 'Yes! We specialize in custom cakes for all occasions including birthdays, weddings, anniversaries, and corporate events. Use our interactive Custom Cake Builder to design your base, size, toppings, and message, or get in touch for special complex designs.'
  },
  {
    id: 2,
    question: 'Do you offer same-day delivery?',
    answer: 'Yes, same-day delivery is available for orders placed before 2:00 PM local time. Please check product availability in the shop. Custom cakes usually require at least 24-48 hours notice.'
  },
  {
    id: 3,
    question: 'Do you make eggless or gluten-free cakes?',
    answer: 'Yes! We offer eggless variants for almost all our cakes and pastries. During checkout or cake customization, you can toggle the "Eggless" option. We also have select gluten-free macarons and flourless desserts.'
  },
  {
    id: 4,
    question: 'What payment methods are accepted?',
    answer: 'We accept credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Cash on Delivery (COD) for qualified areas.'
  },
  {
    id: 5,
    question: 'Can I order online and pick up in store?',
    answer: 'Absolutely! During the checkout flow, you can choose "Store Pickup" instead of "Home Delivery" and select your preferred pickup time.'
  }
];

window.bakeryBlogs = [
  {
    id: 1,
    title: 'Secret Tips for Fluffy Chocolate Sponges',
    summary: 'Discover the exact baking temperatures, ingredients, and mixing ratios our master bakers use to achieve the fluffiest chocolate crumb.',
    author: 'Chef Olivia Ross',
    date: 'July 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    content: `<p>Baking a perfectly fluffy chocolate sponge cake is both an art and a precise science. Many home bakers struggle with dry, dense, or sunken sponges. Today, we are opening our kitchen vault to share the 5 golden rules our professional pastry chefs swear by.</p>
              <h4>1. Ingredient Temperature is Paramount</h4>
              <p>Always ensure your butter, eggs, and milk are at room temperature. Cold ingredients do not emulsify properly, trapping less air and leading to a heavy sponge.</p>
              <h4>2. Bloom Your Cocoa Powder</h4>
              <p>Pour hot water or hot coffee over your cocoa powder before mixing it into the batter. This "blooming" process dissolves the cocoa particles and releases intense chocolate aromatic oils.</p>
              <h4>3. Do Not Overmix</h4>
              <p>Once you add your flour, fold it gently using a spatula in a figure-eight motion. Overmixing develops gluten, which makes the cake tough rather than light and airy.</p>`
  },
  {
    id: 2,
    title: '5 Crucial Wedding Cake Trends of 2026',
    summary: 'From minimalist pressed-flower decorations to luxurious textured structures, here are the designs taking center stage this wedding season.',
    author: 'Elena Sterling',
    date: 'June 28, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600',
    content: `<p>Wedding cakes have evolved far beyond plain white tiers. Couples in 2026 are looking for personalized, artistic masterpieces that reflect their design aesthetics and tell a story.</p>
              <h4>1. Pressed Edible Flowers</h4>
              <p>Instead of heavy sugar flowers, decorators are placing delicate, pressed colorful edible flowers directly onto smooth buttercream, giving cakes a rustic, botanical appearance.</p>
              <h4>2. Textural Mastery</h4>
              <p>Couples are requesting textures that mimic fabric, marble, concrete, or deckled paper. Achieving this requires meticulous icing sculpting or royal icing painting.</p>
              <h4>3. Intimate Mini Cakes</h4>
              <p>Instead of one massive display cake, couples are opting for a small ceremonial cutting cake alongside custom dessert tables loaded with matching macarons, cupcakes, and tarts.</p>`
  },
  {
    id: 3,
    title: 'The Art of Mastering French Macarons',
    summary: 'The ultimate guide to making shiny, smooth-topped Parisian macarons with perfect feet, even in humid home environments.',
    author: 'Chef Jean-Luc',
    date: 'June 15, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600',
    content: `<p>The French macaron has a reputation for being notoriously difficult. But with patience, the right scale, and an understanding of the batter's consistency (the "macaronage"), anyone can make perfect shells.</p>
              <h4>1. Age Your Egg Whites</h4>
              <p>Separate egg whites 24-48 hours before baking and keep them covered in the fridge. This reduces moisture content, increasing protein concentration and resulting in a stronger meringue.</p>
              <h4>2. Sift Twice</h4>
              <p>Always process your almond flour and powdered sugar in a food processor, then sift them twice. Large chunks will cause bumpy, dull tops.</p>
              <h4>3. The "Lava" Test</h4>
              <p>Fold your batter until it falls off the spatula in ribbon layers like flowing lava. If it breaks, it is undermixed. If it flows out completely and disappears, it is overmixed.</p>`
  }
];

window.bakeryGalleryItems = [
  { id: 1, category: 'birthday-cakes', title: 'Magical Unicorn Birthday Cake', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=600' },
  { id: 2, category: 'wedding-cakes', title: 'Elegant Rose Gold Wedding Cake', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600' },
  { id: 3, category: 'cupcakes', title: 'Velvet Swirl Berry Cupcakes', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600' },
  { id: 4, category: 'cookies', title: 'Warm Chocolate Fudge Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600' },
  { id: 5, category: 'pastries', title: 'Cream Custard Fruit Tarts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600' },
  { id: 6, category: 'brownies', title: 'Salted Caramel Chewy Brownies', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600' },
  { id: 7, category: 'behind-the-scenes', title: 'Our Head Baker Preparing Sourdough', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600' },
  { id: 8, category: 'wedding-cakes', title: 'Naked Buttercream Wedding Cake', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
  { id: 9, category: 'behind-the-scenes', title: 'Frosting the Velvet Cakes', image: 'https://images.unsplash.com/photo-1582231374119-8414523c9288?auto=format&fit=crop&q=80&w=600' }
];
