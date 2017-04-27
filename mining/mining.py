import time
import numpy as np
import matplotlib.pyplot as plt
import nltk
import re
import xml.etree.ElementTree as ElementTree
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from sklearn import cluster, datasets
from sklearn.neighbors import kneighbors_graph
from sklearn.preprocessing import StandardScaler


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


titles, docs1 = getDocs('./data/Manpad.jig')
print(len(docs1))
titles, docs2 = getDocs('./data/Crescent.jig')
print(len(docs2))
titles, docs3 = getDocs('./data/AtlanticStorm.jig')
print(len(docs3))
titles, docs4 = getDocs('./data/InfovisPapers.jig')
print(len(docs4))
titles, docs5 = getDocs('./data/VAST2007.jig')
print(len(docs5))
titles, docs6 = getDocs('./data/VAST2014.jig')
print(len(docs6))

tfidf_vectorizer = TfidfVectorizer(stop_words='english', use_idf=True,
                                   tokenizer=tokenize, analyzer='word')
X1 = tfidf_vectorizer.fit_transform(docs1)
X2 = tfidf_vectorizer.fit_transform(docs2)
X3 = tfidf_vectorizer.fit_transform(docs3)
X4 = tfidf_vectorizer.fit_transform(docs4)
X5 = tfidf_vectorizer.fit_transform(docs5)
X6 = tfidf_vectorizer.fit_transform(docs6)

terms = tfidf_vectorizer.get_feature_names()


# Cosine similarity
# print('Cosine similarity')
# mining = 1 - cosine_similarity(X)
# mining = normalize(mining, norm='max')


# Machine Learning Clusters
clustering_names = [
    'MiniBatchKMeans', 'AffinityPropagation', 'MeanShift',
    'SpectralClustering', 'Ward', 'AgglomerativeClustering',
    'DBSCAN', 'Birch']

colors = np.array([x for x in 'bgrcmykbgrcmykbgrcmykbgrcmyk'])
colors = np.hstack([colors] * 20)

datasets = [X1, X2, X3, X4, X5, X6]
for i_dataset, dataset in enumerate(datasets):
    # estimate bandwidth for mean shift
    print('----------------------------')
    X = dataset.toarray()

    X = StandardScaler().fit_transform(X)

    bandwidth = cluster.estimate_bandwidth(X, quantile=0.3)

    print(bandwidth)

    # connectivity matrix for structured Ward
    connectivity = kneighbors_graph(X, n_neighbors=10, include_self=False)
    # make connectivity symmetric
    connectivity = 0.5 * (connectivity + connectivity.T)

    # create clustering estimators
    ms = cluster.MeanShift(bandwidth=bandwidth, bin_seeding=True)
    two_means = cluster.MiniBatchKMeans(n_clusters=7)
    ward = cluster.AgglomerativeClustering(n_clusters=7, linkage='ward',
                                           connectivity=connectivity)
    spectral = cluster.SpectralClustering(n_clusters=7,
                                          eigen_solver='arpack',
                                          affinity="nearest_neighbors")
    dbscan = cluster.DBSCAN(eps=.2)
    affinity_propagation = cluster.AffinityPropagation(damping=.9,
                                                       preference=-200)

    average_linkage = cluster.AgglomerativeClustering(
        linkage="average", affinity="cityblock", n_clusters=7,
        connectivity=connectivity)

    birch = cluster.Birch(n_clusters=7)
    clustering_algorithms = [
        two_means, affinity_propagation, ms, spectral, ward, average_linkage,
        dbscan, birch]

    plot_num = 1
    for name, algorithm in zip(clustering_names, clustering_algorithms):
        # predict cluster memberships
        t0 = time.time()
        algorithm.fit(X)
        t1 = time.time()
        if hasattr(algorithm, 'labels_'):
            y_pred = algorithm.labels_.astype(np.int)
        else:
            y_pred = algorithm.predict(X)

        print(y_pred)

        # plot
        plt.subplot(4, len(clustering_algorithms), plot_num)
        if i_dataset == 0:
            plt.title(name, size=18)
        plt.scatter(X[:, 0], X[:, 1], color=colors[y_pred].tolist(), s=10)

        if hasattr(algorithm, 'cluster_centers_'):
            centers = algorithm.cluster_centers_
            center_colors = colors[:len(centers)]
            plt.scatter(centers[:, 0], centers[:, 1], s=100, c=center_colors)
        plt.xlim(-2, 2)
        plt.ylim(-2, 2)
        plt.xticks(())
        plt.yticks(())
        plt.text(.99, .01, ('%.2fs' % (t1 - t0)).lstrip('0'),
                 transform=plt.gca().transAxes, size=15,
                 horizontalalignment='right')
        plot_num += 1
plt.show()
