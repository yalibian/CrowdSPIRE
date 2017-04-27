import time
import numpy as np
import matplotlib.pyplot as plt
import nltk
import re
import xml.etree.ElementTree as ElementTree
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from sklearn import cluster, mixture
from sklearn.neighbors import kneighbors_graph
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import MDS


# return titles
def getDocs(path):
    titles = []
    texts = []
    parser = ElementTree.XMLParser(encoding="utf-8")
    # parser.parser
    tree = ElementTree.parse(path, parser=parser)
    # tree = ET.fromstring(xmlstring, parser=parser)
    root = tree.getroot()
    for child in root:
        for sub in child:
            if sub.tag == 'docID':
                titles.append(sub.text)
            if sub.tag == 'docText':
                texts.append(sub.text)
    return titles, texts


def tokenize(text):
    # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
    tokens = [word.lower() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = []
    # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
    for token in tokens:
        if re.search('[a-zA-Z]', token):
            filtered_tokens.append(token)
    return filtered_tokens

file = ['Crescent', 'Manpad', 'AtlanticStorm', 'InfovisPapers', 'VAST2007', 'VAST2014']
titles1, docs1 = getDocs('./data/Crescent.jig')
titles2, docs2 = getDocs('./data/Manpad.jig')
titles3, docs3 = getDocs('./data/AtlanticStorm.jig')
titles4, docs4 = getDocs('./data/InfovisPapers.jig')
titles5, docs5 = getDocs('./data/VAST2007.jig')
titles6, docs6 = getDocs('./data/VAST2014.jig')

tfidf_vectorizer = TfidfVectorizer(stop_words='english', use_idf=True,
                                   tokenizer=tokenize, analyzer='word')
X1 = tfidf_vectorizer.fit_transform(docs1)
X2 = tfidf_vectorizer.fit_transform(docs2)
X3 = tfidf_vectorizer.fit_transform(docs3)
X4 = tfidf_vectorizer.fit_transform(docs4)
X5 = tfidf_vectorizer.fit_transform(docs5)
X6 = tfidf_vectorizer.fit_transform(docs6)

terms = tfidf_vectorizer.get_feature_names()


# Machine Learning Clusters
clustering_names = [
    'MiniBatchKMeans', 'MeanShift',
    'SpectralClustering', 'Ward', 'AgglomerativeClustering',
    'DBSCAN', 'Birch', 'GaussianMixture']

colors = np.array([x for x in 'bgrcmykbgrcmykbgrcmykbgrcmyk'])
colors = np.hstack([colors] * 20)

plt.figure(figsize=(len(clustering_names) * 2 + 3, 9.5))
plt.subplots_adjust(left=.02, right=.98, bottom=.001, top=.96, wspace=.05,
                    hspace=.01)

# datasets = [X1, X2, X3, X4, X5, X6]
datasets = [X1, X2, X3, X4]
# datasets = [X3]
plot_num = 1
for i_dataset, dataset in enumerate(datasets):
    print('----------------------------')
    print('DataSet: ' + file[i_dataset])
    # Cosine similarity
    dist = 1 - cosine_similarity(dataset)
    # dist = normalize(dist, norm='max')
    mds = MDS(n_components=2, dissimilarity="precomputed", random_state=1)
    pos = mds.fit_transform(dist)
    x, y = pos[:, 0], pos[:, 1]

    X = dataset.toarray()
    X = StandardScaler().fit_transform(X)

    bandwidth = cluster.estimate_bandwidth(X, quantile=0.3)

    # connectivity matrix for structured Ward
    connectivity = kneighbors_graph(X, n_neighbors=10, include_self=False)
    # make connectivity symmetric
    connectivity = 0.5 * (connectivity + connectivity.T)

    # create clustering estimators
    ms = cluster.MeanShift(bandwidth=bandwidth, bin_seeding=True)
    two_means = cluster.MiniBatchKMeans(n_clusters=3)
    ward = cluster.AgglomerativeClustering(n_clusters=3, linkage='ward',
                                           connectivity=connectivity)
    spectral = cluster.SpectralClustering(n_clusters=3,
                                          eigen_solver='arpack',
                                          affinity="nearest_neighbors")
    dbscan = cluster.DBSCAN(eps=.3)
    affinity_propagation = cluster.AffinityPropagation(damping=.9,
                                                       preference=-200)

    average_linkage = cluster.AgglomerativeClustering(
        linkage="average", affinity="cityblock", n_clusters=3,
        connectivity=connectivity)

    birch = cluster.Birch(n_clusters=3)
    gmm = mixture.GaussianMixture(
        n_components=3, covariance_type='full')

    clustering_algorithms = [
        two_means, ms, spectral, ward, average_linkage,
        dbscan, birch, gmm]

    for name, algorithm in zip(clustering_names, clustering_algorithms):
        # predict cluster memberships
        t0 = time.time()
        algorithm.fit(X)
        t1 = time.time()
        if hasattr(algorithm, 'labels_'):
            y_pred = algorithm.labels_.astype(np.int)
        else:
            y_pred = algorithm.predict(X)

        # plot
        plt.subplot(len(datasets), len(clustering_algorithms), plot_num)
        if i_dataset == 0:
            plt.title(name, size=10)
        plt.scatter(x, y, color=colors[y_pred].tolist(), s=10)

        plt.xlim(-2, 2)
        plt.ylim(-2, 2)
        plt.xticks(())
        plt.yticks(())
        plt.text(.99, .01, ('%.2fs' % (t1 - t0)).lstrip('0'),
                 transform=plt.gca().transAxes, size=15,
                 horizontalalignment='right')
        plot_num += 1
        print('Algorithm: ' + name + '  Time: ' + '%.2fs' % (t1 - t0))
plt.show()
