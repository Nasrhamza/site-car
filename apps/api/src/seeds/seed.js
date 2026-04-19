// Seed de démonstration : utilisateurs, voitures, blog et avis.
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import Car from "../models/Car.js";
import Post from "../models/Post.js";
import Review from "../models/Review.js";

await mongoose.connect(process.env.MONGODB_URI);

await Promise.all([
  User.deleteMany({}),
  Car.deleteMany({}),
  Post.deleteMany({}),
  Review.deleteMany({})
]);

const admin = await User.create({
  name: process.env.ADMIN_BOOTSTRAP_NAME || "Admin HAROU HEDWANI",
  email: (process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@harouhedwani.com").toLowerCase(),
  password: process.env.ADMIN_BOOTSTRAP_PASSWORD || "Admin123!",
  role: "Admin",
  emailVerified: true
});

const cars = await Car.insertMany([
  {
    "name": "Toyota Corolla 2023",
    "slug": "toyota-corolla-2023",
    "brand": "Toyota",
    "model": "Corolla",
    "category": "Citadines / Compactes",
    "year": 2023,
    "mileage": 18000,
    "fuelType": "Essence",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Blanc",
    "doors": 4,
    "seats": 5,
    "drivetrain": "2WD",
    "powerHp": 140,
    "powerKw": 103,
    "price": 83900,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Nouveau",
      "Promo"
    ],
    "rating": 4.8,
    "views": 298,
    "liveWatchers": 5,
    "description": "Magnifique Toyota Corolla en excellent état, finition premium et historique clair.",
    "shortDescription": "Toyota Corolla, essence, automatique, 18000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Toyota Corolla vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Toyota Corolla vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Toyota Corolla vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": true,
    "featured": true
  },
  {
    "name": "BMW X5 2022",
    "slug": "bmw-x5-2022",
    "brand": "BMW",
    "model": "X5",
    "category": "SUV & 4x4",
    "year": 2022,
    "mileage": 42000,
    "fuelType": "Diesel",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Noir",
    "doors": 5,
    "seats": 5,
    "drivetrain": "AWD",
    "powerHp": 286,
    "powerKw": 210,
    "price": 249000,
    "priceType": "Négociable",
    "status": "Disponible",
    "badges": [
      "Occasion",
      "Luxe"
    ],
    "rating": 5.0,
    "views": 224,
    "liveWatchers": 0,
    "description": "Magnifique BMW X5 en excellent état, finition premium et historique clair.",
    "shortDescription": "BMW X5, diesel, automatique, 42000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "BMW X5 vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "BMW X5 vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "BMW X5 vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": false,
    "featured": true
  },
  {
    "name": "Mercedes Classe C 2024",
    "slug": "mercedes-classe-c-2024",
    "brand": "Mercedes",
    "model": "Classe C",
    "category": "Berlines & Limousines",
    "year": 2024,
    "mileage": 9000,
    "fuelType": "Hybride",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Gris",
    "doors": 4,
    "seats": 5,
    "drivetrain": "2WD",
    "powerHp": 204,
    "powerKw": 150,
    "price": 219000,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Nouveau"
    ],
    "rating": 4.2,
    "views": 366,
    "liveWatchers": 4,
    "description": "Magnifique Mercedes Classe C en excellent état, finition premium et historique clair.",
    "shortDescription": "Mercedes Classe C, hybride, automatique, 9000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Mercedes Classe C vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Mercedes Classe C vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Mercedes Classe C vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": true,
    "featured": true
  },
  {
    "name": "Peugeot 208 2021",
    "slug": "peugeot-208-2021",
    "brand": "Peugeot",
    "model": "208",
    "category": "Citadines / Compactes",
    "year": 2021,
    "mileage": 51000,
    "fuelType": "Essence",
    "transmission": "Manuelle",
    "gearbox": "Manuelle",
    "exteriorColor": "Rouge",
    "doors": 4,
    "seats": 5,
    "drivetrain": "2WD",
    "powerHp": 100,
    "powerKw": 74,
    "price": 64900,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Occasion"
    ],
    "rating": 5.0,
    "views": 89,
    "liveWatchers": 6,
    "description": "Magnifique Peugeot 208 en excellent état, finition premium et historique clair.",
    "shortDescription": "Peugeot 208, essence, manuelle, 51000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Peugeot 208 vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Peugeot 208 vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Peugeot 208 vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": false,
    "featured": false
  },
  {
    "name": "Tesla Model 3 2024",
    "slug": "tesla-model-3-2024",
    "brand": "Tesla",
    "model": "Model 3",
    "category": "Électriques & Hybrides",
    "year": 2024,
    "mileage": 7000,
    "fuelType": "Électrique",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Bleu",
    "doors": 4,
    "seats": 5,
    "drivetrain": "AWD",
    "powerHp": 325,
    "powerKw": 239,
    "price": 189000,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Nouveau",
      "Électrique"
    ],
    "rating": 4.2,
    "views": 89,
    "liveWatchers": 0,
    "description": "Magnifique Tesla Model 3 en excellent état, finition premium et historique clair.",
    "shortDescription": "Tesla Model 3, électrique, automatique, 7000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Tesla Model 3 vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Tesla Model 3 vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Tesla Model 3 vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": true,
    "featured": true
  },
  {
    "name": "Ford Ranger 2022",
    "slug": "ford-ranger-2022",
    "brand": "Ford",
    "model": "Ranger",
    "category": "Pick-up & Camions légers",
    "year": 2022,
    "mileage": 35000,
    "fuelType": "Diesel",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Orange",
    "doors": 4,
    "seats": 5,
    "drivetrain": "4WD",
    "powerHp": 213,
    "powerKw": 157,
    "price": 164000,
    "priceType": "Négociable",
    "status": "Disponible",
    "badges": [
      "Promo"
    ],
    "rating": 4.4,
    "views": 67,
    "liveWatchers": 1,
    "description": "Magnifique Ford Ranger en excellent état, finition premium et historique clair.",
    "shortDescription": "Ford Ranger, diesel, automatique, 35000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Ford Ranger vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Ford Ranger vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Ford Ranger vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": false,
    "featured": false
  },
  {
    "name": "Audi A5 Cabriolet 2023",
    "slug": "audi-a5-cabriolet-2023",
    "brand": "Audi",
    "model": "A5 Cabriolet",
    "category": "Coupés & Cabriolets",
    "year": 2023,
    "mileage": 12000,
    "fuelType": "Essence",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Noir",
    "doors": 2,
    "seats": 4,
    "drivetrain": "2WD",
    "powerHp": 265,
    "powerKw": 195,
    "price": 198000,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Luxe",
      "Nouveau"
    ],
    "rating": 5.0,
    "views": 196,
    "liveWatchers": 4,
    "description": "Magnifique Audi A5 Cabriolet en excellent état, finition premium et historique clair.",
    "shortDescription": "Audi A5 Cabriolet, essence, automatique, 12000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Audi A5 Cabriolet vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Audi A5 Cabriolet vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Audi A5 Cabriolet vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": true,
    "featured": true
  },
  {
    "name": "Renault Kangoo 2021",
    "slug": "renault-kangoo-2021",
    "brand": "Renault",
    "model": "Kangoo",
    "category": "Utilitaires & Fourgons",
    "year": 2021,
    "mileage": 62000,
    "fuelType": "Diesel",
    "transmission": "Manuelle",
    "gearbox": "Manuelle",
    "exteriorColor": "Blanc",
    "doors": 4,
    "seats": 2,
    "drivetrain": "2WD",
    "powerHp": 95,
    "powerKw": 70,
    "price": 72900,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Occasion certifiée"
    ],
    "rating": 4.9,
    "views": 328,
    "liveWatchers": 6,
    "description": "Magnifique Renault Kangoo en excellent état, finition premium et historique clair.",
    "shortDescription": "Renault Kangoo, diesel, manuelle, 62000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Renault Kangoo vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Renault Kangoo vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Renault Kangoo vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": false,
    "featured": false
  },
  {
    "name": "Lexus RX 450h 2022",
    "slug": "lexus-rx-450h-2022",
    "brand": "Lexus",
    "model": "RX 450h",
    "category": "Voitures de luxe & Sport",
    "year": 2022,
    "mileage": 28000,
    "fuelType": "Hybride",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Or",
    "doors": 5,
    "seats": 5,
    "drivetrain": "AWD",
    "powerHp": 313,
    "powerKw": 230,
    "price": 229000,
    "priceType": "Négociable",
    "status": "Disponible",
    "badges": [
      "Luxe",
      "Promo"
    ],
    "rating": 4.7,
    "views": 371,
    "liveWatchers": 1,
    "description": "Magnifique Lexus RX 450h en excellent état, finition premium et historique clair.",
    "shortDescription": "Lexus RX 450h, hybride, automatique, 28000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Lexus RX 450h vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Lexus RX 450h vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Lexus RX 450h vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": true,
    "featured": true
  },
  {
    "name": "Hyundai Tucson 2025",
    "slug": "hyundai-tucson-2025",
    "brand": "Hyundai",
    "model": "Tucson",
    "category": "Voitures récentes (moins de 2 ans)",
    "year": 2025,
    "mileage": 4000,
    "fuelType": "Hybride",
    "transmission": "Automatique",
    "gearbox": "Automatique",
    "exteriorColor": "Vert",
    "doors": 5,
    "seats": 5,
    "drivetrain": "AWD",
    "powerHp": 230,
    "powerKw": 169,
    "price": 179000,
    "priceType": "Prix fixe",
    "status": "Disponible",
    "badges": [
      "Nouveau"
    ],
    "rating": 4.7,
    "views": 180,
    "liveWatchers": 4,
    "description": "Magnifique Hyundai Tucson en excellent état, finition premium et historique clair.",
    "shortDescription": "Hyundai Tucson, hybride, automatique, 4000 km.",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        "alt": "Hyundai Tucson vue 1"
      },
      {
        "url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "alt": "Hyundai Tucson vue 2"
      },
      {
        "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "alt": "Hyundai Tucson vue 3"
      }
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "pdfUrl": "https://example.com/fiche-technique.pdf",
    "equipment": [
      "Climatisation",
      "GPS",
      "Caméra de recul",
      "Radar avant/arrière",
      "Bluetooth",
      "Jantes alliage"
    ],
    "features": [
      {
        "label": "Garantie",
        "value": "12 mois"
      },
      {
        "label": "Origine",
        "value": "Import officiel"
      },
      {
        "label": "Carnet",
        "value": "Disponible"
      }
    ],
    "promoted": true,
    "featured": true
  }
]);

await Post.insertMany([
  {
    title: "Comment choisir une voiture familiale en 2026",
    slug: "choisir-voiture-familiale-2026",
    coverImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Nos conseils pour comparer l'espace, la sécurité et le budget.",
    content: "<p>Un guide complet pour les familles...</p>",
    category: "Conseils achat",
    tags: ["famille", "achat", "suv"],
    author: "Admin HAROU HEDWANI",
    readingTime: 6
  },
  {
    title: "SUV hybride ou diesel : lequel choisir ?",
    slug: "suv-hybride-ou-diesel",
    coverImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Comparatif budget, consommation et revente.",
    content: "<p>Dans cet article, nous comparons...</p>",
    category: "Comparatifs",
    tags: ["suv", "hybride", "diesel"],
    author: "Admin HAROU HEDWANI",
    readingTime: 5
  }
]);

await Review.insertMany([
  {
    user: admin._id,
    car: cars[0]._id,
    name: "Sonia B.",
    rating: 5,
    comment: "Service impeccable, voiture livrée dans un état parfait.",
    approved: true
  },
  {
    user: admin._id,
    car: cars[1]._id,
    name: "Karim T.",
    rating: 4,
    comment: "Très bonne équipe commerciale et excellent suivi.",
    approved: true
  }
]);

console.log("✅ Seed terminé");
await mongoose.disconnect();
