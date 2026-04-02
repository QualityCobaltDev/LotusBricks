import {
  PrismaClient,
  UserRole,
  ListingStatus,
  PlanTier,
  ListingType,
  PropertyCategory,
  PropertyAvailability,
  FurnishingType
} from "@prisma/client";
import { createHash } from "node:crypto";
import { PLAN_CONFIG, STANDARD_PLAN_ORDER, formatUsd } from "../src/lib/plans";

const prisma = new PrismaClient();

const hashPassword = (value: string) => createHash("sha256").update(value).digest("hex");

type SeedListing = {
  slug: string;
  title: string;
  listingType: ListingType;
  category: PropertyCategory;
  availability: PropertyAvailability;
  featured: boolean;
  city: string;
  district: string;
  commune: string;
  streetAddress: string;
  mapLabel: string;
  latitude: number;
  longitude: number;
  priceUsd: number;
  priceSuffix?: string;
  originalPriceUsd?: number;
  negotiable: boolean;
  serviceFees?: string;
  annualManagementFee?: string;
  depositTerms: string;
  paymentTerms: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  landAreaSqm?: number;
  floors?: number;
  parkingSpaces?: number;
  furnishing: FurnishingType;
  titleType: string;
  yearBuilt?: number;
  renovatedYear?: number;
  orientation: string;
  propertyCondition: string;
  summary: string;
  heroDescription: string;
  description: string;
  fullDescription: string;
  keySellingPoints: string[];
  idealFor: string[];
  neighborhoodBenefits: string[];
  investmentHighlights: string[];
  features: string[];
  indoorFeatures: string[];
  outdoorFeatures: string[];
  securityFeatures: string[];
  lifestyleFeatures: string[];
  availabilityDate: Date;
  viewingAvailability: string;
  agentName: string;
  agentRole: string;
  enquirySubjectTemplate: string;
  seoTitle: string;
  seoDescription: string;
  badges: string[];
  sortOrder: number;
  similarListings: string[];
};

const mediaAngles = [
  "Exterior front view",
  "Living room main angle",
  "Kitchen and dining area",
  "Master bedroom",
  "Ensuite bathroom",
  "Balcony or terrace view",
  "Secondary bedroom",
  "Guest bathroom",
  "Building amenities",
  "Neighborhood frontage"
];

function createGallery(slug: string, title: string) {
  return mediaAngles.map((caption, index) => ({
    kind: "image",
    url: `/media/properties/${slug}/photo-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `${title} - ${caption.toLowerCase()}`,
    caption,
    isPrimary: index === 0,
    sortOrder: index + 1
  }));
}

function createVideos(slug: string, title: string) {
  return [
    {
      kind: "video",
      url: `/media/properties/${slug}/video-01.mp4`,
      thumbnail: `/media/properties/${slug}/video-01-thumb.jpg`,
      title: `${title} full property walkthrough`,
      description: "Full property walkthrough",
      sortOrder: 11
    },
    {
      kind: "video",
      url: `/media/properties/${slug}/video-02.mp4`,
      thumbnail: `/media/properties/${slug}/video-02-thumb.jpg`,
      title: `${title} neighborhood and exterior overview`,
      description: "Neighborhood and exterior overview",
      sortOrder: 12
    }
  ];
}

const CONTACT_PHONE = "(+855) 011 389 625";
const CONTACT_EMAIL = "contact@rightbricks.online";

const listings: SeedListing[] = [
  {
    slug: "modern-riverside-condo-balcony-daun-penh",
    title: "Modern Riverside Condo with Balcony",
    listingType: ListingType.RENT,
    category: PropertyCategory.CONDO,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "Daun Penh",
    commune: "Phsar Kandal I",
    streetAddress: "Riverside promenade zone, Daun Penh",
    mapLabel: "Riverside Condo - Daun Penh",
    latitude: 11.5685,
    longitude: 104.9282,
    priceUsd: 850,
    priceSuffix: "/month",
    negotiable: true,
    serviceFees: "Building management included; utilities metered separately.",
    depositTerms: "2 months deposit + 1 month advance rent.",
    paymentTerms: "Monthly transfer in USD by the 5th of each month.",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 95,
    floors: 1,
    parkingSpaces: 1,
    furnishing: FurnishingType.FULLY_FURNISHED,
    titleType: "Strata title",
    yearBuilt: 2018,
    renovatedYear: 2024,
    orientation: "West with river outlook",
    propertyCondition: "Excellent",
    summary: "A bright, fully furnished riverside condo with balcony views and walkable access to Phnom Penh's dining and business core.",
    heroDescription: "Positioned in Daun Penh's riverside quarter, this two-bedroom home combines practical layout planning with a polished modern interior. The balcony captures sunset river views while the living and dining spaces stay comfortably separated for work and daily life. Residents benefit from managed security, on-site parking, and immediate access to cafés, embassies, and offices.",
    description: "This residence is designed for renters who want central convenience without compromising comfort. The open-plan living space receives natural light throughout the afternoon, and the kitchen is equipped with full-size appliances, quality cabinetry, and ample storage for long-term tenants. Both bedrooms are proportioned for queen-size setups, while the second room can function as a guest suite or a home office.\n\nThe building provides reliable elevator access, reception support, and controlled entry points. A fitness corner and rooftop relaxation deck add value for residents balancing work and lifestyle in the city center. The unit has recently been refreshed with updated lighting and soft-furnishing details to create a more premium finish.\n\nFrom this location, riverside retail, major banks, and international dining options are all within short distance. The property is particularly attractive for professionals, couples, and relocating expats who want straightforward commuting and a lively neighborhood atmosphere.",
    fullDescription: "Well-managed condominium unit in Daun Penh with stable rental demand and strong tenant retention profile.",
    keySellingPoints: ["River-facing balcony", "2 bathrooms for practical sharing", "Walkable central location", "Managed building with security", "Move-in ready furnishing"],
    idealFor: ["Expats on annual contracts", "Young professional couples", "Embassy-adjacent corporate renters"],
    neighborhoodBenefits: ["Riverside promenade and dining", "Fast access to Wat Phnom and central offices", "Strong late-evening transport availability", "Close to daily convenience retail"],
    investmentHighlights: ["Consistent expat demand in district", "Low vacancy risk for furnished 2-bed inventory", "Attractive yield for city-core leasing"],
    features: ["Balcony", "Split-type air conditioning", "Washer/dryer", "High-speed internet ready", "Elevator access", "Reception desk", "Backup generator", "Secure basement parking", "Rooftop deck", "Smart lock entry"],
    indoorFeatures: ["Open-plan living", "Two full bathrooms", "Built-in wardrobes", "Modern fitted kitchen"],
    outdoorFeatures: ["Private balcony", "Shared rooftop seating"],
    securityFeatures: ["24/7 guard team", "CCTV", "Access card controls"],
    lifestyleFeatures: ["Walkable to restaurants", "River jogging access", "Nearby coworking hubs"],
    availabilityDate: new Date("2026-04-15T00:00:00.000Z"),
    viewingAvailability: "Mon-Sat, 9:00-18:30 with 2-hour prior booking.",
    agentName: "Sokha Vann",
    agentRole: "Senior Leasing Consultant",
    enquirySubjectTemplate: "Enquiry: Modern Riverside Condo with Balcony",
    seoTitle: "Modern Riverside Condo for Rent in Daun Penh | RightBricks",
    seoDescription: "Rent this 2-bedroom riverside condo in Daun Penh for $850/month. Fully furnished, balcony views, secure managed building.",
    badges: ["For Rent", "Featured", "Verified", "Riverside"],
    sortOrder: 1,
    similarListings: ["affordable-city-apartment-near-business-district", "high-floor-penthouse-skyline-views-tonle-bassac", "serviced-office-space-ready-bkk1"]
  },
  {
    slug: "luxury-family-villa-private-garden-bkk",
    title: "Luxury Family Villa with Private Garden",
    listingType: ListingType.SALE,
    category: PropertyCategory.VILLA,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "Boeung Keng Kang",
    commune: "BKK2",
    streetAddress: "Quiet residential lane near BKK core",
    mapLabel: "Luxury Family Villa - BKK",
    latitude: 11.548,
    longitude: 104.9175,
    priceUsd: 420000,
    negotiable: true,
    serviceFees: "Privately managed property; no shared strata fee.",
    annualManagementFee: "N/A",
    depositTerms: "10% reservation deposit on SPA signing.",
    paymentTerms: "Balance payable at transfer via bank-certified payment.",
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 320,
    landAreaSqm: 450,
    floors: 2,
    parkingSpaces: 3,
    furnishing: FurnishingType.SEMI_FURNISHED,
    titleType: "Hard title",
    yearBuilt: 2019,
    renovatedYear: 2025,
    orientation: "South-east",
    propertyCondition: "Excellent",
    summary: "Prestige 4-bedroom villa in BKK with landscaped private garden, multi-car parking, and premium family-oriented interior planning.",
    heroDescription: "Set on a generous 450 sqm land plot in Boeung Keng Kang, this villa delivers privacy, quality finishes, and practical family flow. Spacious reception and dining zones open directly onto a manicured garden suitable for children, gatherings, or future pool integration. The home has been upgraded in 2025 and is offered semi-furnished for buyers who want immediate usability with design flexibility.",
    description: "The ground floor places entertaining and daily living functions around a bright internal layout, with large glazed openings to the outdoor garden. The kitchen includes substantial storage, prep space, and direct service access that supports household staff or catered hosting. A dedicated guest suite with en-suite bath improves convenience for extended family visits.\n\nUpstairs, the primary suite includes walk-in storage, garden-facing windows, and a generous bathroom with separate wet and dry areas. Secondary bedrooms all include private bathrooms, enabling comfortable multi-generational living or high-end long-stay leasing configuration.\n\nFrom a location standpoint, the villa is within quick reach of international schools, healthcare providers, and top retail/dining corridors in BKK. Hard-title ownership and strong neighborhood demand also support long-term value retention.",
    fullDescription: "A premium family asset in one of Phnom Penh's most established residential districts.",
    keySellingPoints: ["Hard-title ownership", "450 sqm private land", "Landscaped garden", "5 bathrooms", "Prime BKK neighborhood"],
    idealFor: ["Families seeking central living", "Owner-occupiers upgrading to villa format", "Investors targeting executive tenant profiles"],
    neighborhoodBenefits: ["Near international schools", "Excellent medical access", "Prestige BKK address", "Strong road connectivity"],
    investmentHighlights: ["Prime district resale resilience", "Executive leasing potential", "Flexible use as residence or diplomatic lease"],
    features: ["Private garden", "Semi-open show kitchen", "Maid's utility room", "Covered parking", "Solar hot water", "CCTV setup", "Auto gate", "Balcony terraces", "Dedicated family lounge", "Premium sanitary fittings"],
    indoorFeatures: ["High ceiling living hall", "Guest suite", "Walk-in closet", "Dry and wet kitchens"],
    outdoorFeatures: ["Landscaped garden", "Terrace seating", "Perimeter wall"],
    securityFeatures: ["CCTV", "Motorized gate", "Perimeter alarm pre-wire"],
    lifestyleFeatures: ["Near top restaurants", "Short drive to malls", "Quiet residential lane"],
    availabilityDate: new Date("2026-05-01T00:00:00.000Z"),
    viewingAvailability: "Daily by appointment, 9:30-17:30.",
    agentName: "Dara Chhem",
    agentRole: "Residential Sales Advisor",
    enquirySubjectTemplate: "Enquiry: Luxury Family Villa with Private Garden",
    seoTitle: "Luxury 4-Bedroom Villa for Sale in BKK Phnom Penh | RightBricks",
    seoDescription: "Explore this semi-furnished 4-bedroom hard-title villa in Boeung Keng Kang with private garden and premium family layout.",
    badges: ["For Sale", "Featured", "Luxury", "Hard Title"],
    sortOrder: 2,
    similarListings: ["contemporary-townhouse-gated-community-sen-sok", "investment-condo-russian-market-rental-appeal", "residential-development-land-plot-chbar-ampov"]
  },
  {
    slug: "affordable-city-apartment-near-business-district",
    title: "Affordable City Apartment Near Business District",
    listingType: ListingType.RENT,
    category: PropertyCategory.APARTMENT,
    availability: PropertyAvailability.AVAILABLE,
    featured: false,
    city: "Phnom Penh",
    district: "Chamkarmon",
    commune: "Tonle Bassac fringe",
    streetAddress: "Inner lane with direct road access to business district",
    mapLabel: "Affordable City Apartment - Chamkarmon",
    latitude: 11.5432,
    longitude: 104.9221,
    priceUsd: 550,
    priceSuffix: "/month",
    negotiable: false,
    serviceFees: "Includes weekly cleaning and internet.",
    depositTerms: "1 month deposit + 1 month rent in advance.",
    paymentTerms: "Monthly cash or bank transfer.",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 58,
    floors: 1,
    parkingSpaces: 1,
    furnishing: FurnishingType.FULLY_FURNISHED,
    titleType: "Strata title",
    yearBuilt: 2020,
    orientation: "North-east",
    propertyCondition: "Very good",
    summary: "Value-driven one-bedroom apartment with complete furnishings, excellent commuter access, and practical monthly terms.",
    heroDescription: "This furnished 58 sqm apartment offers an efficient floor plan for professionals who prioritize location and affordability. Positioned near the Chamkarmon business corridor, it keeps commute times short while providing a calm lane-facing setting. The rent package includes key operational conveniences to reduce day-to-day setup friction.",
    description: "The living area is arranged to support both relaxation and remote work, with natural daylight and dedicated dining space. A compact but functional kitchen includes induction cooking, refrigerator, and storage cabinetry suitable for daily use. The bedroom fits a queen setup and wardrobe storage, and the bathroom is cleanly finished with water-heater support.\n\nThe building maintains regular housekeeping in common areas and controlled access for resident safety. Parking for motorbike and selected car slots is available on-site.\n\nWith favorable pricing and central connectivity, this apartment performs well for first-time Phnom Penh renters, relocation staff, and younger professionals building convenience-first routines.",
    fullDescription: "Practical and central, this unit is designed to keep monthly living predictable and efficient.",
    keySellingPoints: ["Competitive monthly rate", "Fully furnished package", "Business district access", "Efficient 1-bed plan"],
    idealFor: ["Single professionals", "First-time city renters", "Remote workers"],
    neighborhoodBenefits: ["Nearby supermarkets", "Close cafés and gyms", "Fast access to BKK/Tonle Bassac"],
    investmentHighlights: ["Consistent tenant demand in sub-$600 segment", "Low turnover for furnished units"],
    features: ["Fiber internet", "Housekeeping support", "Air conditioning", "Fridge and cooktop", "Elevator", "Parking", "Keycard entry", "Water heater"],
    indoorFeatures: ["Dedicated dining nook", "Built-in storage", "Workspace-ready living zone"],
    outdoorFeatures: ["Shared rooftop laundry drying area"],
    securityFeatures: ["Keycard access", "Night security", "CCTV"],
    lifestyleFeatures: ["Short commute", "Walkable daily conveniences", "Budget-friendly city living"],
    availabilityDate: new Date("2026-04-10T00:00:00.000Z"),
    viewingAvailability: "Mon-Sun, 8:30-19:00.",
    agentName: "Lina Sok",
    agentRole: "Leasing Executive",
    enquirySubjectTemplate: "Enquiry: Affordable City Apartment Near Business District",
    seoTitle: "Affordable 1-Bedroom Apartment for Rent in Chamkarmon | RightBricks",
    seoDescription: "Rent this furnished 1-bedroom apartment in Chamkarmon for $550/month with included internet and excellent city access.",
    badges: ["For Rent", "Verified", "Value"],
    sortOrder: 3,
    similarListings: ["modern-riverside-condo-balcony-daun-penh", "serviced-office-space-ready-bkk1", "high-floor-penthouse-skyline-views-tonle-bassac"]
  },
  {
    slug: "contemporary-townhouse-gated-community-sen-sok",
    title: "Contemporary Townhouse in Gated Community",
    listingType: ListingType.SALE,
    category: PropertyCategory.TOWNHOUSE,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "Sen Sok",
    commune: "Kouk Khleang",
    streetAddress: "Secure gated borey community, Sen Sok",
    mapLabel: "Townhouse - Sen Sok",
    latitude: 11.5934,
    longitude: 104.8865,
    priceUsd: 185000,
    negotiable: true,
    serviceFees: "Community fee approx. $35/month.",
    annualManagementFee: "$420/year",
    depositTerms: "5% booking deposit, refundable under due diligence terms.",
    paymentTerms: "Bank financing available with staged disbursement.",
    bedrooms: 3,
    bathrooms: 4,
    areaSqm: 180,
    landAreaSqm: 120,
    floors: 3,
    parkingSpaces: 2,
    furnishing: FurnishingType.SEMI_FURNISHED,
    titleType: "Borey title transfer supported",
    yearBuilt: 2021,
    orientation: "South",
    propertyCondition: "Very good",
    summary: "Modern 3-floor townhouse in a secure Sen Sok community, ideal for family living with schools and retail nearby.",
    heroDescription: "Located in one of Sen Sok's fast-growing residential clusters, this townhouse balances security, convenience, and long-term ownership value. The three-floor layout separates family, guest, and private spaces effectively, while semi-furnished handover supports immediate occupancy. Residents also enjoy gated-community operations and a family-friendly neighborhood profile.",
    description: "The home's ground level includes a flexible front living zone, guest bathroom, and functional kitchen area ready for customization. Upper levels provide three bedrooms with four bathrooms total, allowing families to avoid typical townhouse layout compromises. The top floor can be configured as a second lounge, workspace, or hobby area depending on lifestyle needs.\n\nCommunity infrastructure includes controlled-entry gates, internal roads, and a consistent maintenance program. The area is favored by growing families because it combines quieter surroundings with practical access to schools, shopping, and ring-road transport links.\n\nFor buyers focused on value and future growth, Sen Sok remains one of Phnom Penh's strongest owner-occupier and resale markets.",
    fullDescription: "Secure, modern, and efficiently priced for family buyers entering Phnom Penh's suburban growth corridor.",
    keySellingPoints: ["Gated community", "3 floors with flexible layout", "4 bathrooms", "Family-oriented district"],
    idealFor: ["Young families", "First-time homeowners", "Investors seeking suburban demand"],
    neighborhoodBenefits: ["Close to AEON 2 zone", "Nearby schools and clinics", "Less congestion than city core"],
    investmentHighlights: ["Sen Sok growth trajectory", "Good resale liquidity", "Rental demand from family tenants"],
    features: ["2-car parking", "Community security", "Semi-furnished handover", "Balcony", "Top-floor multi-use space", "Aircon pre-install", "Water storage tank", "Modern façade"],
    indoorFeatures: ["Open living layout", "Multiple bathrooms", "Natural ventilation"],
    outdoorFeatures: ["Front parking apron", "Balcony spaces"],
    securityFeatures: ["Gated entry", "24/7 patrol", "CCTV at community points"],
    lifestyleFeatures: ["Family parks nearby", "Community retail", "School shuttle access"],
    availabilityDate: new Date("2026-04-20T00:00:00.000Z"),
    viewingAvailability: "Tue-Sun, 9:00-17:30.",
    agentName: "Bopha Lim",
    agentRole: "Residential Sales Specialist",
    enquirySubjectTemplate: "Enquiry: Contemporary Townhouse in Gated Community",
    seoTitle: "3-Bedroom Townhouse for Sale in Sen Sok Phnom Penh | RightBricks",
    seoDescription: "Buy this modern 3-bedroom townhouse in a gated Sen Sok community for $185,000 with family-ready layout and secure living.",
    badges: ["For Sale", "Featured", "Family Home"],
    sortOrder: 4,
    similarListings: ["luxury-family-villa-private-garden-bkk", "residential-development-land-plot-chbar-ampov", "investment-condo-russian-market-rental-appeal"]
  },
  {
    slug: "high-floor-penthouse-skyline-views-tonle-bassac",
    title: "High-Floor Penthouse with Skyline Views",
    listingType: ListingType.LUXURY,
    category: PropertyCategory.PENTHOUSE,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "Tonle Bassac",
    commune: "Tonle Bassac",
    streetAddress: "High-rise residence near NagaWorld district",
    mapLabel: "Penthouse - Tonle Bassac",
    latitude: 11.5474,
    longitude: 104.933,
    priceUsd: 2800,
    priceSuffix: "/month",
    originalPriceUsd: 3200,
    negotiable: true,
    serviceFees: "Management fee included; premium utilities billed by usage.",
    depositTerms: "2 months security deposit + 1 month advance.",
    paymentTerms: "Quarterly preferred; monthly accepted.",
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 240,
    floors: 1,
    parkingSpaces: 2,
    furnishing: FurnishingType.FULLY_FURNISHED,
    titleType: "Strata title",
    yearBuilt: 2019,
    renovatedYear: 2025,
    orientation: "Dual aspect city-river view",
    propertyCondition: "Premium",
    summary: "Executive penthouse with expansive entertaining areas, skyline views, and luxury finishes in Tonle Bassac.",
    heroDescription: "Occupying a high floor in Tonle Bassac, this penthouse is tailored for clients seeking premium city living with elevated privacy. Interiors are fully furnished with upscale finishes, and floor-to-ceiling glazing frames broad Phnom Penh skyline views. Large social areas make this a standout option for both executive housing and high-end long-stay tenants.",
    description: "The residence offers a generous main lounge that transitions into formal dining and a fully equipped kitchen with integrated appliances. Each bedroom is en-suite, with the primary suite featuring a larger walk-in zone and dedicated relaxation corner. Materials and lighting were refreshed in 2025 to strengthen the contemporary luxury profile.\n\nResidents enjoy high-rise amenities including a pool deck, gym, concierge support, and secure parking. The unit's entertaining-friendly plan is ideal for frequent hosting while preserving private bedroom separation.\n\nTonle Bassac continues to draw premium renters due to proximity to embassies, business towers, and lifestyle venues, supporting both convenience and long-term rental resilience.",
    fullDescription: "A polished, high-floor lifestyle residence with strong executive leasing appeal.",
    keySellingPoints: ["High-floor skyline views", "240 sqm interior", "3 en-suite bedrooms", "Premium furnished handover", "Luxury tower amenities"],
    idealFor: ["Executives", "Diplomatic households", "Luxury-focused urban renters"],
    neighborhoodBenefits: ["Near embassies and offices", "Premium dining and retail", "Quick riverfront connectivity"],
    investmentHighlights: ["Strong high-end tenant demand", "Limited comparable penthouse inventory", "Improved pricing vs prior ask"],
    features: ["Floor-to-ceiling glazing", "Designer furniture", "Wine storage", "Integrated kitchen", "Private balcony", "Pool access", "Gym", "Concierge", "Dual parking", "Smart climate control"],
    indoorFeatures: ["En-suite rooms", "Formal dining", "Walk-in closet", "Acoustic glazing"],
    outdoorFeatures: ["Skyline balcony", "Tower pool deck"],
    securityFeatures: ["24/7 security", "Lift card zoning", "Basement access control"],
    lifestyleFeatures: ["Luxury tower living", "Entertainment-ready plan", "Central premium district"],
    availabilityDate: new Date("2026-04-12T00:00:00.000Z"),
    viewingAvailability: "Private appointments, daily 10:00-20:00.",
    agentName: "Rithy Neang",
    agentRole: "Luxury Leasing Advisor",
    enquirySubjectTemplate: "Enquiry: High-Floor Penthouse with Skyline Views",
    seoTitle: "Luxury Penthouse for Rent in Tonle Bassac Phnom Penh | RightBricks",
    seoDescription: "Discover this 3-bedroom high-floor penthouse in Tonle Bassac at $2,800/month with skyline views and premium amenities.",
    badges: ["For Rent", "Luxury", "Featured", "New Listing"],
    sortOrder: 5,
    similarListings: ["modern-riverside-condo-balcony-daun-penh", "affordable-city-apartment-near-business-district", "investment-condo-russian-market-rental-appeal"]
  },
  {
    slug: "commercial-shophouse-busy-main-road-toul-kork",
    title: "Commercial Shophouse on Busy Main Road",
    listingType: ListingType.COMMERCIAL,
    category: PropertyCategory.SHOPHOUSE,
    availability: PropertyAvailability.AVAILABLE,
    featured: false,
    city: "Phnom Penh",
    district: "Toul Kork",
    commune: "Boeng Kak 1",
    streetAddress: "Main-road frontage, Toul Kork corridor",
    mapLabel: "Commercial Shophouse - Toul Kork",
    latitude: 11.5752,
    longitude: 104.9051,
    priceUsd: 1500,
    priceSuffix: "/month",
    negotiable: true,
    depositTerms: "3 months deposit due to commercial fit-out risk.",
    paymentTerms: "Monthly or quarterly options; annual lease preferred.",
    bedrooms: 0,
    bathrooms: 2,
    areaSqm: 210,
    floors: 3,
    parkingSpaces: 2,
    furnishing: FurnishingType.UNFURNISHED,
    titleType: "Commercial leasehold",
    yearBuilt: 2017,
    orientation: "Main-road frontage",
    propertyCondition: "Good",
    summary: "Three-floor shophouse with high visibility frontage, ideal for retail, showroom, clinic, or office-service operations.",
    heroDescription: "This Toul Kork shophouse is strategically positioned on a busy commercial corridor with strong passing traffic. The 210 sqm layout across three floors supports customer-facing operations downstairs with office or storage functions above. Unfurnished condition allows direct customization for brand and operational requirements.",
    description: "Ground-floor frontage offers excellent signage and customer entry visibility, while the upper floors can accommodate administration, consultation rooms, or inventory. Ceiling heights and staircase width support practical business use for a range of formats. Two bathrooms and rear service access improve day-to-day staff convenience.\n\nThe surrounding area is established with education centers, retail clusters, and mixed-use residential demand, creating steady customer flow throughout the week. Lease terms are structured for commercial certainty and can be discussed for multi-year commitments.\n\nFor operators scaling in Phnom Penh, this unit provides balanced affordability, exposure, and functional flexibility.",
    fullDescription: "Main-road visibility and flexible commercial layout make this a practical launch or expansion address.",
    keySellingPoints: ["Strong frontage visibility", "Three functional floors", "Commercial-ready terms", "Unfurnished for fit-out flexibility"],
    idealFor: ["Retail brands", "Service businesses", "Showrooms", "Tuition centers"],
    neighborhoodBenefits: ["Established Toul Kork foot traffic", "Mixed residential and business catchment", "Good connector-road access"],
    investmentHighlights: ["Stable demand for road-facing units", "Long-term business tenancy potential"],
    features: ["Main-road exposure", "Roller shutter frontage", "Rear service access", "2 bathrooms", "3 floors", "Signage potential", "Dedicated meter setup", "Parking apron"],
    indoorFeatures: ["Open floor plates", "High ceilings", "Back-office potential"],
    outdoorFeatures: ["Street-facing frontage", "Front parking"],
    securityFeatures: ["Shutter security", "Perimeter grill options", "Street CCTV coverage"],
    lifestyleFeatures: ["Near cafes and banks", "Dense neighborhood customer base"],
    availabilityDate: new Date("2026-04-08T00:00:00.000Z"),
    viewingAvailability: "Mon-Sat, 8:00-17:30.",
    agentName: "Kosal Touch",
    agentRole: "Commercial Leasing Agent",
    enquirySubjectTemplate: "Enquiry: Commercial Shophouse on Busy Main Road",
    seoTitle: "Commercial Shophouse for Rent in Toul Kork Phnom Penh | RightBricks",
    seoDescription: "Lease this 3-floor commercial shophouse in Toul Kork for $1,500/month. Ideal for retail, office, showroom, or service business.",
    badges: ["For Rent", "Commercial", "Main Road"],
    sortOrder: 6,
    similarListings: ["serviced-office-space-ready-bkk1", "modern-warehouse-office-component-por-sen-chey", "high-floor-penthouse-skyline-views-tonle-bassac"]
  },
  {
    slug: "serviced-office-space-ready-bkk1",
    title: "Serviced Office Space Ready for Immediate Use",
    listingType: ListingType.COMMERCIAL,
    category: PropertyCategory.OFFICE,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "BKK1",
    commune: "Boeung Keng Kang I",
    streetAddress: "Central business zone, BKK1",
    mapLabel: "Serviced Office - BKK1",
    latitude: 11.5536,
    longitude: 104.9227,
    priceUsd: 1200,
    priceSuffix: "/month",
    negotiable: false,
    serviceFees: "Includes reception, internet, and common-area cleaning.",
    depositTerms: "2 months deposit + 1 month advance.",
    paymentTerms: "Monthly billing; annual contract preferred.",
    bedrooms: 0,
    bathrooms: 2,
    areaSqm: 110,
    floors: 1,
    parkingSpaces: 2,
    furnishing: FurnishingType.FULLY_FURNISHED,
    titleType: "Commercial lease",
    yearBuilt: 2021,
    orientation: "City view",
    propertyCondition: "Excellent",
    summary: "Fully furnished serviced office in BKK1 with immediate move-in readiness, reception support, and premium business address.",
    heroDescription: "Designed for teams that need speed and professionalism, this BKK1 office delivers turnkey occupancy from day one. The layout supports private workstations, collaborative tables, and meeting functionality without upfront fit-out costs. Shared services are built into the package, reducing operational complexity.",
    description: "Interior fit-out includes ergonomic desks, lighting optimized for all-day use, and clean partitioning for managerial privacy. Two bathrooms serve staff and visitors, while reception support handles greeting and basic coordination. Reliable internet and backup power continuity are included to support uninterrupted operations.\n\nThe location benefits from BKK1's high-profile commercial ecosystem, with nearby banking, food, and hospitality services that improve staff and client experience. This makes it suitable for representative offices, consulting teams, and regional project operations.\n\nFor businesses prioritizing image, convenience, and immediate functionality, this is a strong central Phnom Penh option.",
    fullDescription: "Move-in-ready serviced office inventory remains limited in BKK1 at this quality and size level.",
    keySellingPoints: ["Immediate occupancy", "Fully furnished", "Reception support", "Prime BKK1 address"],
    idealFor: ["Consulting firms", "Regional sales teams", "Startup headquarters"],
    neighborhoodBenefits: ["Prestige business district", "Nearby banks and dining", "Strong client accessibility"],
    investmentHighlights: ["No fit-out capex required", "Predictable monthly operating cost"],
    features: ["Reception desk", "Meeting corner", "Ergonomic furniture", "Fiber internet", "Backup generator", "Keycard access", "2 parking spots", "Shared pantry", "Daily cleaning"],
    indoorFeatures: ["Partitioned workspace", "Manager cabin", "Natural daylight"],
    outdoorFeatures: ["Building drop-off", "Street-facing signage directory"],
    securityFeatures: ["24/7 guard", "Keycard access", "Lobby CCTV"],
    lifestyleFeatures: ["Central professional district", "Team-friendly amenities", "Client-ready environment"],
    availabilityDate: new Date("2026-04-05T00:00:00.000Z"),
    viewingAvailability: "Business days 8:30-18:00, Saturday by request.",
    agentName: "Mony Chan",
    agentRole: "Commercial Office Consultant",
    enquirySubjectTemplate: "Enquiry: Serviced Office Space Ready for Immediate Use",
    seoTitle: "Serviced Office for Rent in BKK1 Phnom Penh | RightBricks",
    seoDescription: "Lease this fully furnished 110 sqm serviced office in BKK1 for $1,200/month with reception, internet, and immediate move-in setup.",
    badges: ["For Rent", "Commercial", "Featured", "Move-In Ready"],
    sortOrder: 7,
    similarListings: ["commercial-shophouse-busy-main-road-toul-kork", "modern-warehouse-office-component-por-sen-chey", "affordable-city-apartment-near-business-district"]
  },
  {
    slug: "residential-development-land-plot-chbar-ampov",
    title: "Residential Development Land Plot",
    listingType: ListingType.LAND,
    category: PropertyCategory.LAND,
    availability: PropertyAvailability.AVAILABLE,
    featured: false,
    city: "Phnom Penh",
    district: "Chbar Ampov",
    commune: "Nirouth",
    streetAddress: "Growth corridor near planned residential expansion roads",
    mapLabel: "Development Land - Chbar Ampov",
    latitude: 11.5002,
    longitude: 104.9581,
    priceUsd: 265000,
    negotiable: true,
    depositTerms: "10% booking deposit upon accepted offer.",
    paymentTerms: "Progressive payment over 60 days supported.",
    bedrooms: 0,
    bathrooms: 0,
    areaSqm: 780,
    landAreaSqm: 780,
    parkingSpaces: 0,
    furnishing: FurnishingType.NOT_APPLICABLE,
    titleType: "Hard title",
    orientation: "Rectangular plot with road access",
    propertyCondition: "Vacant land",
    summary: "780 sqm hard-title land parcel in Chbar Ampov suited to residential project development or strategic land banking.",
    heroDescription: "This freehold land plot in Chbar Ampov presents a practical entry point for developers and long-term investors. With clear dimensions and direct road approach, the parcel supports low-rise residential planning, townhouse rows, or phased development concepts. The district's expansion profile underpins long-horizon value growth potential.",
    description: "The site sits in an area experiencing steady residential spillover from core Phnom Penh neighborhoods. Its 780 sqm footprint offers planning flexibility for both owner-build and small-scale project strategies. Hard-title status simplifies legal certainty and enhances financing confidence compared with less formal options.\n\nNearby infrastructure upgrades and evolving neighborhood services continue to improve livability and marketability for future projects. For investors, this plot can also function as a strategic hold aligned to district urbanization momentum.\n\nRightBricks can support due-diligence review, zoning checks, and comparable pricing analysis during negotiation.",
    fullDescription: "A versatile development parcel with title clarity and favorable positioning in a growing district.",
    keySellingPoints: ["Hard-title ownership", "780 sqm usable parcel", "Road-accessible", "Development-ready dimensions"],
    idealFor: ["Residential developers", "Long-term land investors", "Family office land banking"],
    neighborhoodBenefits: ["Emerging residential demand", "Access to bridge connectors", "Growing local retail services"],
    investmentHighlights: ["Urban expansion tailwind", "Flexible development pathways", "Title-secure asset class"],
    features: ["Hard title", "Road frontage", "Flat topography", "Rectangular layout", "Development corridor location", "Utility access nearby", "Flexible exit strategies", "Freehold transfer support"],
    indoorFeatures: [],
    outdoorFeatures: ["Vacant clear parcel"],
    securityFeatures: ["Perimeter markers installed"],
    lifestyleFeatures: ["Future-family housing potential", "Community growth zone"],
    availabilityDate: new Date("2026-04-30T00:00:00.000Z"),
    viewingAvailability: "Site walk-through by appointment with 24-hour notice.",
    agentName: "Vicheka Oum",
    agentRole: "Land & Development Advisor",
    enquirySubjectTemplate: "Enquiry: Residential Development Land Plot",
    seoTitle: "780 sqm Residential Land for Sale in Chbar Ampov | RightBricks",
    seoDescription: "Buy this hard-title 780 sqm development land plot in Chbar Ampov for $265,000. Ideal for residential development or land banking.",
    badges: ["For Sale", "Land", "Investment"],
    sortOrder: 8,
    similarListings: ["contemporary-townhouse-gated-community-sen-sok", "luxury-family-villa-private-garden-bkk", "investment-condo-russian-market-rental-appeal"]
  },
  {
    slug: "modern-warehouse-office-component-por-sen-chey",
    title: "Modern Warehouse with Office Component",
    listingType: ListingType.COMMERCIAL,
    category: PropertyCategory.WAREHOUSE,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "Por Sen Chey",
    commune: "Chaom Chau",
    streetAddress: "Industrial connector route near airport access roads",
    mapLabel: "Warehouse + Office - Por Sen Chey",
    latitude: 11.5468,
    longitude: 104.8243,
    priceUsd: 2200,
    priceSuffix: "/month",
    negotiable: true,
    depositTerms: "3 months security deposit.",
    paymentTerms: "Monthly; discounted terms for annual lease.",
    bedrooms: 0,
    bathrooms: 3,
    areaSqm: 600,
    landAreaSqm: 900,
    floors: 1,
    parkingSpaces: 8,
    furnishing: FurnishingType.UNFURNISHED,
    titleType: "Commercial leasehold",
    yearBuilt: 2022,
    orientation: "Truck-access front",
    propertyCondition: "Excellent",
    summary: "600 sqm warehouse with integrated office block and ample truck maneuvering area in Por Sen Chey logistics corridor.",
    heroDescription: "This modern warehouse combines practical storage volume with built-in office functionality for efficient operations management. The site is configured for logistics users needing loading access, staff workspace, and reliable transport links. Its Por Sen Chey location supports airport-adjacent distribution and city-wide dispatch.",
    description: "The warehouse floorplate offers clear-span utility suitable for racking, light assembly, or wholesale inventory use. A dedicated office component enables on-site supervision, administration, and client-facing coordination without separate leasing overhead. Three bathrooms and multiple parking bays support larger staffing patterns.\n\nThe 900 sqm land footprint allows smoother vehicle circulation and loading activity, reducing bottlenecks common in tighter industrial lots. Utility provisioning and structure quality are aligned with modern commercial requirements.\n\nFor businesses scaling storage and last-mile capabilities, this asset provides a balanced rental profile with immediate operational practicality.",
    fullDescription: "Purpose-built logistics functionality with office integration in a high-demand industrial district.",
    keySellingPoints: ["600 sqm warehouse area", "Office component included", "Airport-corridor access", "Truck-friendly site"],
    idealFor: ["E-commerce logistics", "Distribution firms", "Import/export support teams"],
    neighborhoodBenefits: ["Fast access to airport zone", "Industrial service ecosystem", "Good arterial road links"],
    investmentHighlights: ["Strong demand for medium-format industrial stock", "Operational cost efficiency through integrated office"],
    features: ["Clear-span warehouse", "Integrated office block", "3 bathrooms", "Roll-up shutters", "Truck turning area", "8 parking spaces", "High-load flooring", "Utility-ready"],
    indoorFeatures: ["Office meeting room", "Staff workspace", "Storage-ready open bay"],
    outdoorFeatures: ["Truck loading apron", "Yard maneuvering area"],
    securityFeatures: ["Perimeter wall", "Gatehouse point", "CCTV-ready cabling"],
    lifestyleFeatures: ["Operationally efficient location", "Easy workforce commute from western districts"],
    availabilityDate: new Date("2026-04-18T00:00:00.000Z"),
    viewingAvailability: "Mon-Sat, 9:00-17:00.",
    agentName: "Chetra Nget",
    agentRole: "Industrial Leasing Consultant",
    enquirySubjectTemplate: "Enquiry: Modern Warehouse with Office Component",
    seoTitle: "Warehouse for Rent in Por Sen Chey Phnom Penh | RightBricks",
    seoDescription: "Lease this 600 sqm modern warehouse with office component in Por Sen Chey for $2,200/month. Ideal for logistics and storage operations.",
    badges: ["For Rent", "Commercial", "Featured", "Warehouse"],
    sortOrder: 9,
    similarListings: ["commercial-shophouse-busy-main-road-toul-kork", "serviced-office-space-ready-bkk1", "residential-development-land-plot-chbar-ampov"]
  },
  {
    slug: "investment-condo-russian-market-rental-appeal",
    title: "Investment Condo Unit with Strong Rental Appeal",
    listingType: ListingType.INVESTMENT,
    category: PropertyCategory.CONDO,
    availability: PropertyAvailability.AVAILABLE,
    featured: true,
    city: "Phnom Penh",
    district: "Russian Market Area",
    commune: "Tuol Tompoung",
    streetAddress: "Tuol Tompoung mixed-use zone near Russian Market",
    mapLabel: "Investment Condo - Russian Market",
    latitude: 11.5404,
    longitude: 104.9139,
    priceUsd: 128000,
    negotiable: true,
    serviceFees: "$0.9/sqm monthly management fee.",
    annualManagementFee: "Approx. $670/year",
    depositTerms: "5% booking deposit; balance at transfer.",
    paymentTerms: "Cash purchase or bank mortgage support available.",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 62,
    floors: 1,
    parkingSpaces: 1,
    furnishing: FurnishingType.FULLY_FURNISHED,
    titleType: "Strata title",
    yearBuilt: 2022,
    orientation: "East",
    propertyCondition: "Excellent",
    summary: "Turnkey 1-bedroom condo in Russian Market area with high rental demand characteristics and immediate leasing readiness.",
    heroDescription: "Positioned in one of Phnom Penh's most active rental submarkets, this furnished condo is tailored for buy-to-let investors. The 62 sqm plan is efficient yet comfortable, attracting long-stay tenants from professional and expat segments. The building's amenity package and location support consistent occupancy potential.",
    description: "The unit is delivered fully furnished with durable finishes chosen for rental performance and maintenance ease. Open-plan living, fitted kitchen, and practical bedroom proportions align with tenant preferences in the Russian Market zone. A modern bathroom and in-unit laundry area further improve everyday convenience.\n\nBuilding facilities include security controls, shared gym, and rooftop social areas that strengthen leasing competitiveness against older stock. Nearby lifestyle options, supermarkets, and transport links support strong tenant retention.\n\nFor investors prioritizing balanced entry pricing and rental resilience, this listing offers a clear and data-aligned profile.",
    fullDescription: "An investment-focused condo unit with compelling location fundamentals and tenant-ready presentation.",
    keySellingPoints: ["High-demand rental zone", "Fully furnished turnkey unit", "Strata title", "Amenity-supported tower"],
    idealFor: ["Buy-to-let investors", "First-time property investors", "Portfolio diversification buyers"],
    neighborhoodBenefits: ["Russian Market lifestyle district", "Strong food and retail ecosystem", "Convenient inner-city transport links"],
    investmentHighlights: ["Attractive rental demand depth", "Low vacancy profile for furnished 1-bed units", "Manageable entry ticket"],
    features: ["Fully furnished", "In-unit laundry", "Gym access", "Rooftop common area", "Keycard entry", "1 parking space", "Modern kitchen", "Tenant-ready handover"],
    indoorFeatures: ["Efficient 62 sqm plan", "Built-in wardrobes", "Quality air conditioning"],
    outdoorFeatures: ["Shared rooftop lounge"],
    securityFeatures: ["24/7 security", "Access control", "CCTV"],
    lifestyleFeatures: ["Walkable market and cafés", "Popular expat district", "Consistent rental demand"],
    availabilityDate: new Date("2026-04-14T00:00:00.000Z"),
    viewingAvailability: "Daily, 9:00-19:00.",
    agentName: "Sreypov Keo",
    agentRole: "Investment Property Advisor",
    enquirySubjectTemplate: "Enquiry: Investment Condo Unit with Strong Rental Appeal",
    seoTitle: "Investment Condo for Sale near Russian Market Phnom Penh | RightBricks",
    seoDescription: "Buy this furnished 1-bedroom investment condo near Russian Market for $128,000 with strong rental demand and strata title.",
    badges: ["For Sale", "Investment", "Featured", "Verified"],
    sortOrder: 10,
    similarListings: ["modern-riverside-condo-balcony-daun-penh", "affordable-city-apartment-near-business-district", "luxury-family-villa-private-garden-bkk"]
  }
];

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@rightbricks.online" },
    update: {
      fullName: "Platform Admin",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("Admin123!"),
      planTier: PlanTier.TIER_3,
      signupFeePaid: true,
      isActive: true
    },
    create: {
      email: "admin@rightbricks.online",
      fullName: "Platform Admin",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("Admin123!"),
      planTier: PlanTier.TIER_3,
      signupFeePaid: true,
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@rightbricks.online" },
    update: {
      fullName: "Sample Customer",
      role: UserRole.CUSTOMER,
      passwordHash: hashPassword("Customer123!"),
      planTier: PlanTier.TIER_2,
      signupFeePaid: true,
      isActive: true
    },
    create: {
      email: "customer@rightbricks.online",
      fullName: "Sample Customer",
      role: UserRole.CUSTOMER,
      passwordHash: hashPassword("Customer123!"),
      planTier: PlanTier.TIER_2,
      signupFeePaid: true,
      isActive: true
    }
  });

  const customer = await prisma.user.findUniqueOrThrow({ where: { email: "customer@rightbricks.online" }, select: { id: true } });

  const slugs = listings.map((item) => item.slug);
  await prisma.listingMedia.deleteMany({ where: { listing: { slug: { in: slugs } } } });
  await prisma.listing.deleteMany({ where: { slug: { in: slugs } } });

  for (const item of listings) {
    const created = await prisma.listing.create({
      data: {
        slug: item.slug,
        title: item.title,
        listingType: item.listingType,
        category: item.category,
        availability: item.availability,
        featured: item.featured,
        summary: item.summary,
        heroDescription: item.heroDescription,
        description: item.description,
        fullDescription: item.fullDescription,
        country: "Cambodia",
        city: item.city,
        district: item.district,
        commune: item.commune,
        streetAddress: item.streetAddress,
        mapLabel: item.mapLabel,
        latitude: item.latitude,
        longitude: item.longitude,
        neighborhoodSummary: item.neighborhoodBenefits.join(" "),
        currency: "USD",
        priceUsd: item.priceUsd,
        priceSuffix: item.priceSuffix,
        originalPriceUsd: item.originalPriceUsd,
        negotiable: item.negotiable,
        serviceFees: item.serviceFees,
        annualManagementFee: item.annualManagementFee,
        depositTerms: item.depositTerms,
        paymentTerms: item.paymentTerms,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        areaSqm: item.areaSqm,
        landAreaSqm: item.landAreaSqm,
        floors: item.floors,
        parkingSpaces: item.parkingSpaces,
        furnishing: item.furnishing,
        titleType: item.titleType,
        yearBuilt: item.yearBuilt,
        renovatedYear: item.renovatedYear,
        orientation: item.orientation,
        propertyCondition: item.propertyCondition,
        keySellingPoints: item.keySellingPoints,
        idealFor: item.idealFor,
        neighborhoodBenefits: item.neighborhoodBenefits,
        investmentHighlights: item.investmentHighlights,
        features: item.features,
        indoorFeatures: item.indoorFeatures,
        outdoorFeatures: item.outdoorFeatures,
        securityFeatures: item.securityFeatures,
        lifestyleFeatures: item.lifestyleFeatures,
        floorPlanImage: `/media/properties/${item.slug}/floorplan.jpg`,
        brochurePdf: `/media/properties/${item.slug}/brochure.pdf`,
        availabilityDate: item.availabilityDate,
        viewingAvailability: item.viewingAvailability,
        agentName: item.agentName,
        agentRole: item.agentRole,
        contactPhone: CONTACT_PHONE,
        contactEmail: CONTACT_EMAIL,
        whatsappAvailable: true,
        telegramAvailable: true,
        enquirySubjectTemplate: item.enquirySubjectTemplate,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        openGraphImage: `/media/properties/${item.slug}/photo-01.jpg`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: item.title,
          description: item.summary,
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: item.priceUsd
          }
        },
        badges: item.badges,
        breadcrumbs: ["Home", "Listings", item.district, item.title],
        similarListings: item.similarListings,
        sortOrder: item.sortOrder,
        status: ListingStatus.PUBLISHED,
        ownerId: customer.id,
        publishedAt: new Date()
      }
    });

    const gallery = createGallery(item.slug, item.title).map((media) => ({ ...media, listingId: created.id }));
    const videos = createVideos(item.slug, item.title).map((media) => ({ ...media, listingId: created.id, isPrimary: false, alt: null, caption: null }));

    await prisma.listingMedia.createMany({ data: [...gallery, ...videos] as any[] });
  }

  await prisma.pricingPlan.deleteMany();
  await prisma.pricingPlan.createMany({
    data: STANDARD_PLAN_ORDER.map((key, idx) => {
      const plan = PLAN_CONFIG[key];
      return {
        name: plan.name,
        priceLabel: formatUsd(plan.recurringMonthlyUsd ?? 0),
        cadence: "monthly",
        ctaLabel: plan.ctaLabel,
        features: [
          `${plan.listingLimit} ${plan.listingLimit === 1 ? "listing" : "listings"}`,
          `${plan.photosPerListing} photos per listing`,
          `${plan.videosPerListing} videos per listing`,
          `+$${plan.oneTimeSignupFeeUsd} one-time sign-up fee`
        ],
        sortOrder: idx + 1
      };
    }),
    skipDuplicates: true
  });

  await prisma.siteContent.upsert({
    where: { key: "homepage.hero" },
    update: {},
    create: {
      key: "homepage.hero",
      title: "Find trusted property opportunities",
      body: "RightBricks helps buyers, renters, and investors discover verified property listings with transparent details."
    }
  });
}

main().finally(() => prisma.$disconnect());
