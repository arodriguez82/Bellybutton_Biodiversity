function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
      PANEL.append("h6").text("Gender: " + result.gender);
      PANEL.append("h6").text("Age: " + result.age);
      PANEL.append("h6").text("Location: " + result.location);
      PANEL.append("h6").text("BBType: " + result.bbtype);
      PANEL.append("h6").text("Wash Freq: " + result.wfreq);
    });
  };

//Function to build the charts
function buildCharts(sample){
    d3.json("samples.json").then((data) => {
        var OTU = data.samples;
        var resultArray = OTU.filter(sampleObj => sampleObj.id == sample);
        var otuValues = resultArray[0];
        var otuIds = otuValues.otu_ids;
        var otuLabels = otuValues.otu_labels;
        var sampleValues = otuValues.sample_values;

        // Wash Freq Variable for gauge chart
        var metadata = data.metadata;
        var resultData = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultData[0];
        var wFreq = result.wfreq;

// Bar Chart
   
    var trace = {
        x: sampleValues.slice(0,11).reverse(),
        y: "OTU " + otuIds.slice(0,11).reverse(),
        type: "bar",
        orientation: 'h',
        
     };
    var data = [trace];
    var layout = {
        title: "Top Bacterial Species found in ID " + otuValues.id,
        xaxis: { title: "Sample Values"},
        yaxis: { title: "OTU #"},
        margin: {t: 30, l: 100},
    }
    Plotly.newPlot("bar", data, layout);

// Bubble Chart

    var trace1 ={
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
          size: sampleValues,
          sizemode: 'area',
          sizeref: .25,
          color: otuIds,
      }
  };

  var data = [trace1];
  var layout = {
      title: 'Amount of Bacteria by OTU ID #',
      xaxis: {title:{text: 'OTU ID #',}},
      showlegend: false 
  };
  Plotly.newPlot('bubble', data, layout); 

// Gauge Chart

  var data = [
    {
      domain: { x: [resultArray, wFreq], y: [resultArray, wFreq] },
      value: wFreq,
      title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
      type: "indicator",
      gauge: {axis: {range: [null, 9]}},
      mode: "gauge+number"
    }
  ];
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);

  });
};