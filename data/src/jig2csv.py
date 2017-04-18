jig = open('Crescent.jig', 'r')
csv = open('Crescent.tsv', 'w')

csv.write('id\ttext\n')

last_doc_id = -1

for line in jig:
    if "<docID>" in line:
        last_doc_id = line[11:-9].replace(',', ',')
    if "<docText>" in line:
        csv.write(last_doc_id)
        csv.write('\t')
        csv.write(line[13:-11].replace(',', ','))
        csv.write('\n')

csv.close()
jig.close()
