import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#bd0026', '#2c7fb8', '#78c679', '#f768a1', 'fd8d3c', '#fed976'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {

  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })


  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  d3.select('#africa').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Africa') {
        return 'red'
      } else {
        return 'grey'
      }
    })
  })

  d3.select('#asia').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Asia') {
        return 'red'
      } else {
        return 'grey'
      }
    })
  })

  d3.select('#north-america').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return 'red'
      } else {
        return 'grey'
      }
    })
  })

  d3.select('#low-gdp').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 1000) {
        return 'red'
      } else {
        return 'grey'
      }
    })
  })

  d3.select('#color-by-continent').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', 'grey')
  })



  /* Add your rectangles here */

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('fill', 'lightgray')
    .attr('y', function(d) {
      return yPositionScale(d.life_expectancy)
    })
    .attr('height', function(d) {
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('x', function(d) {
      return xPositionScale(d.country)
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
