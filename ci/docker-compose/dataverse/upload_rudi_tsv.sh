# https://guides.dataverse.org/en/latest/admin/metadatacustomization.html

# upload TSV file for RUDI
curl -k -v http://147.210.218.43:8095/api/admin/datasetfield/load -H "Content-type: text/tab-separated-values" -X POST --upload-file rudi.tsv
