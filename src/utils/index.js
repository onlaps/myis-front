import _ from "lodash";

export const filterFormatter = (data, label) => {
  return data.map((item) => ({ value: item.id, text: item[label] }));
};

export const sortAlphaNumeric = (a, b) => {
  a = _.toString(a);
  b = _.toString(b);

  return a.localeCompare(b);
};

export const advancedColumns = (options, filters, sorter) => (data) => {
  if (options) {
    Object.keys(options).forEach((dataIndex) => {
      const index = _.findIndex(data, { dataIndex });
      if (index !== -1) data[index] = { ...data[index], ...options[dataIndex] };
    });
  }

  if (filters) {
    Object.keys(filters).forEach((dataIndex) => {
      const index = _.findIndex(data, { dataIndex });
      if (index !== -1 && filters[dataIndex])
        data[index].filteredValue = filters[dataIndex];
    });
  }

  if (sorter) {
    Object.keys(sorter).forEach((dataIndex) => {
      const index = _.findIndex(data, { dataIndex });
      if (index !== -1 && sorter[dataIndex]) {
        data[index].sortOrder = sorter[dataIndex];
        data[index].sorter = (a, b) => {
          return sortAlphaNumeric(a[dataIndex], b[dataIndex]);
        };
      }
    });
  }
  return data;
};

export const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
