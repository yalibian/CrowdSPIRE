/**
 * Created by Yali on 3/3/17.
 */


// Calculate the distance between two documents based on entity weights

// The normalization must also be weighted. For vectors u and v,
// with weight vector w, the weighted cosine is
// (sum w[i]*u[i]*v[i]) / sqrt[(sum w[i]*u[i]^2)*(sum w[i]*v[i]^2)].
// 余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似，这就叫"余弦相似性"
export default function cosineSimilarity(doc1, doc2, entities) {
    
    let distance = 0.0;
    let len1 = 0.0;
    let len2 = 0.0;
    
    doc1.entities.forEach(function (e1) {
        
        len1 += e1.value * e1.value * entities[e1.name].weight;
        doc2.entities.forEach(function (e2) {
            len2 += e2.value * e2.value * entities[e2.name].weight;
            if (e1.name == e2.name) {
                distance += e1.value * e2.value * entities[e1.name].weight;
            }
        });
        
    });
    
    len1 = Math.sqrt(len1);
    len2 = Math.sqrt(len2);
    
    return distance / (len1 * len2);
}
