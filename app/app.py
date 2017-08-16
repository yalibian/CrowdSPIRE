import json
import operator
import random
from os import listdir
from os.path import isfile, join

import numpy as np
import pandas as pd
from model import aggregate
from model import sampling
from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import MinMaxScaler

from model.PU import PUAdapter

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

# kpiTypes = ["Airtime", "Paging"]
kpiTypes = ["Airtime", "DownlinkBytes", "DownlinkPackets", "Paging", "TotalBytes", "TotalPackets", "TotalRF",
            "UplinkBytes",
            "UplinkPackets"]
# "UplinkPackets", "ConcurrentSessions"]

defaultKPI = ''

kpis = [{"name": "Airtime", 'unit': 'Mesc'}, {"name": "DownlinkBytes", 'unit': 'Mbyte'},
        {"name": "DownlinkPackets", 'unit': 'Mbyte'},
        {"name": "Paging", 'unit': 'Event'},
        {"name": "TotalBytes", 'unit': 'Mbyte'}, {"name": "TotalPackets", 'unit': 'Packet'},
        {"name": "TotalRF", 'unit': 'Event'},
        {"name": "UplinkBytes", 'unit': 'Mbyte'}, {"name": "UplinkPackets", 'unit': 'Packet'}]

dataPath = '../data/Rock/'
cachePath = '../data/Rock/cache'
cachedData = [f for f in listdir(dataPath + 'cache') if isfile(join(cachePath, f))]

timeseries = {}
aggregatedTimeseries = {}
anomaly = {}
y = {}
topN = 4
anomalyDtypes = {"utc": 'str', "data": 'float', "ups": 'float', "lows": 'float', "errs": 'float', "m.pred": 'float',
                 "v.pred": 'float', "llr.pos": 'float', "llr.neg": 'float', "cumsum.llr.pos": 'float',
                 "cumsum.llr.neg": 'float', "s1": 'float', "anomaly": 'str', "date": 'str'}
for k in kpiTypes:
    timeseries[k] = pd.read_csv(dataPath + 'timeseries/' + k + '.csv', parse_dates=['datetime']).fillna(0)
    t = timeseries[k]
    aggregatedTimeseries[k] = aggregate(t)
    anomaly[k] = pd.read_csv(dataPath + 'anomaly/' + k + '.csv', parse_dates=['endTime']).fillna(0)
    anomaly[k]['timeID'] = anomaly[k]['startTime']
    anomaly[k]['startTime'] = pd.to_datetime(anomaly[k]['timeID'])
    y[k] = [-1] * len(anomaly[k])

cachedContext = {"Airtime": {'DownlinkBytes': 0.087958796865412345, 'DownlinkPackets': 0.12508107987900993,
                             'Paging': 0.3998190182729317, 'TotalBytes': 0.10211279921020182,
                             'TotalPackets': 0.15008084650238238, 'TotalRF': 0.48858866490514741,
                             'UplinkBytes': 0.26681839772859556, 'UplinkPackets': 0.15344895140188164},
                 "DownlinkBytes": {'Airtime': 0.087958796865412345, 'DownlinkPackets': 0.83543616191095604,
                                   'Paging': 0.071547393816097857, 'TotalBytes': 0.931592883447102,
                                   'TotalPackets': 0.78281055970456603, 'TotalRF': 0.11611634971111369,
                                   'UplinkBytes': 0.40084146605027021, 'UplinkPackets': 0.72941421047268196},
                 "DownlinkPackets": {'Airtime': 0.12508107987900996, 'DownlinkBytes': 0.83543616191095615,
                                     'Paging': 0.11446694301404552, 'TotalBytes': 0.84904648900309021,
                                     'TotalPackets': 0.9009138232505024, 'TotalRF': 0.160603807723047,
                                     'UplinkBytes': 0.28217713169559738, 'UplinkPackets': 0.79125290014104921},
                 "Paging": {'Airtime': 0.39981901827293165, 'DownlinkBytes': 0.071547393816097857,
                            'DownlinkPackets': 0.1144669430140455, 'TotalBytes': 0.084682579988707651,
                            'TotalPackets': 0.12440784551012175, 'TotalRF': 0.62568249877888382,
                            'UplinkBytes': 0.15452385299421292, 'UplinkPackets': 0.1160388468788673},
                 "TotalBytes": {'Airtime': 0.10211279921020182, 'DownlinkBytes': 0.93159288344710212,
                                'DownlinkPackets': 0.84904648900309032, 'Paging': 0.084682579988707637,
                                'TotalPackets': 0.80364601968054383, 'TotalRF': 0.12605569969281338,
                                'UplinkBytes': 0.36485823645818743, 'UplinkPackets': 0.75688371866765347},
                 "TotalPackets": {'Airtime': 0.15008084650238238, 'DownlinkBytes': 0.78281055970456603,
                                  'DownlinkPackets': 0.90091382325050251, 'Paging': 0.12440784551012175,
                                  'TotalBytes': 0.80364601968054383, 'TotalRF': 0.17314773722135884,
                                  'UplinkBytes': 0.24722008860442157, 'UplinkPackets': 0.85514155271793257},
                 "TotalRF": {'Airtime': 0.48858866490514741, 'DownlinkBytes': 0.1161163497111137,
                             'DownlinkPackets': 0.160603807723047, 'Paging': 0.62568249877888382,
                             'TotalBytes': 0.12605569969281338, 'TotalPackets': 0.17314773722135884,
                             'UplinkBytes': 0.108690795601092, 'UplinkPackets': 0.18243081545165063},
                 "UplinkBytes": {'Airtime': 0.2668183977285955, 'DownlinkBytes': 0.40084146605027021,
                                 'DownlinkPackets': 0.28217713169559738, 'Paging': 0.1545238529942129,
                                 'TotalBytes': 0.36485823645818738, 'TotalPackets': 0.24722008860442157,
                                 'TotalRF': 0.108690795601092, 'UplinkPackets': 0.24775135025646688},
                 "UplinkPackets": {'Airtime': 0.15344895140188164, 'DownlinkBytes': 0.72941421047268185,
                                   'DownlinkPackets': 0.79125290014104932, 'Paging': 0.11603884687886731,
                                   'TotalBytes': 0.75688371866765358, 'TotalPackets': 0.85514155271793268,
                                   'TotalRF': 0.18243081545165063, 'UplinkBytes': 0.24775135025646691}}


# Find the most related top n KPIs, just returns top n related KPIs, not include itself.
# calculate the corelation based on the whole time segment and returns the top-5 related KPIs.
# corelation
def context(k, start=-1, end=-1):
    if start == -1:
        start = timeseries[k]['datetime'].iloc[0]
        end = timeseries[k]['datetime'].iloc[-1]

    # similarities = {}
    # kpi = anomaly_points(k, start, end)
    # for i in kpiTypes:
    #     if i == k:
    #         continue
    #     tmp_kpi = anomaly_points(i, start, end)
    #     sim = corelation(kpi, tmp_kpi)
    #     similarities[i] = sim

    similarities = cachedContext[k]
    similarities = sorted(similarities.items(), key=operator.itemgetter(1), reverse=True)
    aggContext = aggregatedTimeseries[k].drop('value', 1).rename(columns={'type': k})
    # df = anomaly_points(k, start, end)
    # df = df.rename(columns={'type': k})
    # df = df.set_index(['datetime'])
    # df = df[k]
    for i in range(topN):
        k = similarities[i][0]
        aggContext[k] = aggregatedTimeseries[k]['type']
        # df_tmp = anomaly_points(k, start, end) # .set_index(['datetime'])
        # df[k]  = anomaly_points(k, start, end)['type'] # .set_index(['datetime'])
        # df = pd.concat([df, df_tmp.rename(columns={'type': k})[k]], axis=1)
    return aggContext
    # return df.fillna(0)


# Get time segment for the designated KPI with more details.
def focus(k, start, end):
    kpi = timeseries[k]
    return sampling(kpi[(kpi['datetime'] >= start) & (kpi['datetime'] <= end)])


# Get anomaly points in designated time segment for the designated KPI with more details.
def anomaly_points(k, start, end):
    return aggregatedTimeseries[k]
    # kpi = kpi[(kpi['datetime'] >= start) & (kpi['datetime'] <= end) & (kpi['type'] != 0)]
    # return kpi


def cluster(x, k, method):
    x = x.drop('timeID', 1).drop('startTime', 1).drop('endTime', 1).drop('override', 1).drop('min', 1).drop('max', 1)
    features = {}
    featuresName = list(x.columns.values)
    lenFeature = featuresName.__len__()
    for i in range(lenFeature):
        features[featuresName[i]] = 1.0 / lenFeature * (0.5 + random.random())

    x = MinMaxScaler().fit_transform(x)
    x = np.array(x)
    estimator = KMeans(n_clusters=k)
    estimator.fit(x)
    labels = estimator.labels_
    return labels, features


def pu_learning(x, y, method):
    x = x.drop('timeID', 1).drop('startTime', 1).drop('endTime', 1).drop('override', 1).drop('min', 1).drop('max', 1)
    features = {}
    featuresName = list(x.columns.values)
    x = MinMaxScaler().fit_transform(x)
    x = np.array(x)
    y = np.array(y)

    estimatorRF = RandomForestClassifier(n_estimators=100,
                                         criterion='gini',
                                         bootstrap=True,
                                         n_jobs=1)

    paramRF = {
        'n_estimators': [200, 700],
        'max_features': ['auto', 'sqrt', 'log2']
    }
    # estimatorSGD = SGDClassifier(loss="log", penalty="l2")
    # estimatorSVM = SVC(probability=True)
    # estimatorLR = LogisticRegression()
    estimatorKNN = KNeighborsClassifier()
    k_range = range(1, 6)
    weight_options = ['uniform', 'distance']
    paramKNN = dict(n_neighbors=k_range, weights=weight_options)
    # estimatorDT = DecisionTreeClassifier()
    # estimatorNB = GaussianNB()
    # estimatorSVM2 = SVC(kernel='sigmoid', probability=True)

    estimator = estimatorRF
    # estimator = GridSearchCV(estimator, param_grid=paramRF, scoring='precision')
    pu_estimator = PUAdapter(estimator)
    pu_estimator.fit(x, y)
    y_pred = pu_estimator.predict(x)
    y_predict = pu_estimator.predict_proba(x)
    # print(y_predict)
    y_predict = MinMaxScaler().fit_transform(y_predict)
    y_predict = y_predict.argsort()[::-1][:y_predict.size]

    featuresImportance = pu_estimator.feature_importances_()
    order = featuresImportance.argsort()[::-1][:featuresImportance.size]
    for i in order:
        features[featuresName[i]] = featuresImportance[i]
    return y_predict, features


@app.route('/')
def root():
    return app.send_static_file('index.html')


# about
@app.route('/about', methods=['GET', 'POST'])
def details():
    return '<h1>Intern Project for Nokia Bell Labs, by Yali Bian</h1>'


# Restful API: return an array of kpi names
@app.route('/kpiTypes', methods=['GET', 'POST'])
def api_kpi():
    return jsonify(kpis)


# Restful API: return the original timeseries for a specific kpi
# need better sampling here
@app.route('/timeseries/<string:k>', methods=['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
def api_timeseries(k):
    return sampling(timeseries[k]).to_csv()


# Restful API: return the original anomaly for a specific kpi
@app.route('/anomaly/<string:k>', methods=['GET', 'POST', 'PATCH', 'PUT', "DELETE"])
def api_anomaly(k):
    if request.method == 'GET':
        return anomaly[k].to_csv()

    elif request.method == 'POST':
        return anomaly[k].to_csv()

    elif request.method == 'PATCH':
        return anomaly[k].to_csv()

    elif request.method == 'PUT':
        return anomaly[k].to_csv()

    elif request.method == 'DELETE':
        return anomaly[k].to_csv()


@app.route('/focus/<string:k>', methods=['GET', 'POST'])
def api_focus(k):
    if request.method == 'GET':
        return anomaly[k].to_csv()

    if request.method == 'POST':
        data = json.loads(request.data)
        return focus(k, data['start'], data['end']).to_csv()


recommendation = {'items': ['2016-06-24 12:06:00', '2016-06-28 07:16:00', '2016-07-07 22:55:00'],
                  'features': {'weekday': 0.4, 'threshold': 0.35, 'duration': 0.25}}


@app.route('/feedback/<string:k>', methods=['GET', 'POST', 'PATCH'])
def api_feedback(k):
    if request.method == 'GET':
        suggestion = {}
        items = []
        labels, features = cluster(anomaly[k], 12, 'KMeans')
        for i in range(12):
            ii = np.where(labels == i)[0]
            iii = random.choice(ii)
            item = anomaly[k].iloc[iii].to_dict()
            items.append(item['timeID'])
            # print(iii)
        suggestion['items'] = items
        suggestion['features'] = features
        return jsonify(suggestion)
        # return jsonify(recommendation)

    if request.method == 'POST':
        # When anomalies are marked, and the recommender has several positive items, and unlabeled, PULearning is needed
        feedback = json.loads(request.data)
        index = anomaly[k][anomaly[k]['startTime'].isin(feedback)].index.tolist()

        for i in index:
            y[k][i] = +1.0

        results, features = pu_learning(anomaly[k], y[k], 'KNeighborsClassifier')
        suggestion = {}
        items = []
        for i in results:
            if y[k][i] != 1:
                item = anomaly[k].iloc[i].to_dict()
                items.append(item['timeID'])
            if items.__len__() >= 12:
                break

        # print('-------------------------------------FEATURES------------------------------')
        # print(items)
        # print(features)

        suggestion['items'] = items
        suggestion['features'] = features
        return jsonify(suggestion)

    if request.method == 'PATCH':
        feedback = json.loads(request.data)
        suggestion = recommendation
        return jsonify(suggestion)


@app.route('/context/<string:k>', methods=['GET', 'POST'])
def api_context(k):
    if request.method == 'GET':
        return context(k).to_csv()

    if request.method == 'POST':
        data = json.loads(request.data)
        return context(k, start=data['start'], end=data['end']).to_csv()


# if __name__ == '__main__':
app.run(debug=True)
