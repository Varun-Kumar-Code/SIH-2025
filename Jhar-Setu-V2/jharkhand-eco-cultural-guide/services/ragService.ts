
import { RagDocument } from '../types';

const ragDatabase: RagDocument[] = [
  {
    id: '1',
    type: 'site',
    title: 'Dassam Falls',
    content: 'Dassam Falls is a spectacular waterfall near Ranchi, located in Taimara village. It is a natural cascade of the Subarnarekha River. The best time to visit is during the monsoon season (July-September) when the water level is high. It is a popular picnic spot but visitors should be cautious as the rocks can be slippery.',
    keywords: ['waterfall', 'dassam', 'ranchi', 'picnic', 'falls']
  },
  {
    id: '2',
    type: 'site',
    title: 'Netarhat',
    content: 'Known as the "Queen of Chotanagpur", Netarhat is a beautiful hill station famous for its stunning sunrises and sunsets. Key attractions include Magnolia Point and the Upper and Lower Ghaghri Falls. It offers a cool climate and is perfect for nature lovers.',
    keywords: ['netarhat', 'hill station', 'sunrise', 'sunset', 'nature']
  },
  {
    id: '3',
    type: 'culture',
    title: 'Sohrai and Khovar Painting',
    content: 'Sohrai and Khovar are traditional mural art forms practiced by tribal women in Jharkhand. Sohrai is celebrated during the harvest festival, and Khovar is associated with marriage ceremonies. These paintings use natural pigments and depict flora, fauna, and tribal life. They have received the Geographical Indication (GI) tag.',
    keywords: ['painting', 'sohrai', 'khovar', 'art', 'tribal', 'culture']
  },
  {
    id: '4',
    type: 'artisan',
    title: 'Dhokra Art',
    content: 'Dhokra is a non-ferrous metal casting art using the lost-wax casting technique, which is one of the earliest known methods of metal casting. The artisans create intricate figurines of deities, animals, and ritual objects. It is a labor-intensive process, making each piece unique.',
    keywords: ['dhokra', 'dokra', 'metal', 'craft', 'artisan', 'souvenir', 'figurine']
  },
  {
    id: '5',
    type: 'artisan',
    title: 'Wooden Crafts and Toys',
    content: 'Jharkhand has a rich tradition of wood carving. Artisans craft beautiful toys, decorative items, and household objects from local woods like Gamhar and Sal. The wooden toys are often painted in vibrant colors and are eco-friendly souvenirs.',
    keywords: ['wood', 'carving', 'wooden', 'toys', 'handicraft', 'souvenir']
  },
  {
    id: '6',
    type: 'site',
    title: 'Baidyanath Jyotirlinga Temple, Deoghar',
    content: 'One of the twelve Jyotirlingas, the Baidyanath temple in Deoghar is a major Hindu pilgrimage site. The temple complex has 22 temples and attracts millions of devotees, especially during the Shravani Mela.',
    keywords: ['temple', 'deoghar', 'baidyanath', 'jyotirlinga', 'pilgrimage']
  }
];

// Simple keyword-based retrieval function
export const retrieveContext = (query: string): string | null => {
  const queryWords = query.toLowerCase().split(/\s+/);
  const matchedDocs = new Set<RagDocument>();

  ragDatabase.forEach(doc => {
    for (const keyword of doc.keywords) {
      if (queryWords.includes(keyword)) {
        matchedDocs.add(doc);
        break; // Move to next doc once one keyword is matched
      }
    }
  });

  if (matchedDocs.size === 0) {
    return null;
  }

  // Format the context for the LLM
  let contextString = "Relevant Information: ";
  matchedDocs.forEach(doc => {
    contextString += `\n- ${doc.title}: ${doc.content}`;
  });

  return contextString;
};
