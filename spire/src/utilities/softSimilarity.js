/**
 * Created by Yali on 3/3/17.
 */

// Update similarity based on soft similarity
export default function softSimilarity(doc1, doc2, entities, crowd) {
    
    let distance = 0.0;
    let len1 = 0.0;
    let len2 = 0.0;
    
    doc1.entities.forEach(function (e1) {
        len1 += e1.value * e1.value * entities[e1.name].weight;
        doc2.entities.forEach(function (e2) {
            len2 += e2.value * e2.value * entities[e2.name].weight;
            if (e1.name == e2.name) {
                distance += e1.value * e2.value * entities[e1.name].weight;
            } else {
                crowd.links.forEach(function (c) {
                    if ((c.target == e1.name && c.source == e2.name) || (c.target == e2.name && c.source == e2.name)) {
                        distance += c.votes / 275 * entities[e1.name].weight * entities[e2.name].weight * e1.value * e2.value * 125;
                    }
                })
            }
        });
    });
    
    len1 = Math.sqrt(len1);
    len2 = Math.sqrt(len2);
    
    return distance / (len1 * len2);
}

