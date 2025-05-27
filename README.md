
CPU SCHEDULER
Introduction and Problem Statement 
Efficient CPU scheduling plays a vital role in optimizing system performance and resource 
utilization in modern operating systems. The CPU is the central processing unit responsible for 
executing multiple processes simultaneously, and an effective scheduling mechanism is 
essential to ensure fairness, minimize waiting time, reduce turnaround time, and optimize 
throughput. 
As observed by Silberschatz et al. in [1], different CPU scheduling algorithms are suited for 
different types of workloads. While First Come First Serve (FCFS) is simple and easy to 
implement, it may result in high waiting times. On the other hand, algorithms like Shortest Job 
First (SJF), Shortest Remaining Time First (SRTF), Priority Scheduling, and Round Robin 
(RR) are designed to reduce waiting time and improve responsiveness. However, the 
effectiveness of each algorithm highly depends on the nature of incoming processes. 
In practical systems, deciding which scheduling algorithm to use for a specific scenario is non- 
trivial. Static selection of a scheduling algorithm may not always yield optimal performance. 
Therefore, there is a growing need for intelligent systems that can automatically choose the 
best-suited scheduling approach based on workload characteristics. 
To address this challenge, artificial intelligence (AI) can be integrated to build a smart CPU 
scheduler that can analyze task attributes and decide the optimal scheduling policy 
dynamically. This system can also provide a real-time visual representation of scheduling using 
Gantt charts, making it easier for users to understand how processes are being managed by the 
CPU. 
Figure 1.1 illustrates the basic conceptual framework of the proposed smart scheduler with AI- 
based algorithm selection. 




<p align="center">
  <a href="https://www.chartjs.org/" target="_blank">
    <img src="https://www.chartjs.org/media/logo-title.svg" alt="https://www.chartjs.org/"><br/>
  </a>
    Simple yet flexible JavaScript charting for designers & developers
</p>

<p align="center">
    <a href="https://www.chartjs.org/docs/latest/getting-started/installation.html"><img src="https://img.shields.io/github/release/chartjs/Chart.js.svg?style=flat-square&maxAge=600" alt="Downloads"></a>
    <a href="https://github.com/chartjs/Chart.js/actions?query=workflow%3ACI+branch%3Amaster"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/chartjs/Chart.js/ci.yml?branch=master&style=flat-square"></a>
    <a href="https://coveralls.io/github/chartjs/Chart.js?branch=master"><img src="https://img.shields.io/coveralls/chartjs/Chart.js.svg?style=flat-square&maxAge=600" alt="Coverage"></a>
    <a href="https://github.com/chartjs/awesome"><img src="https://awesome.re/badge-flat2.svg" alt="Awesome"></a>
    <a href="https://discord.gg/HxEguTK6av"><img src="https://img.shields.io/badge/discord-chartjs-blue?style=flat-square&maxAge=3600" alt="Discord"></a>
</p>

## Documentation

All the links point to the new version 4 of the lib.

* [Introduction](https://www.chartjs.org/docs/latest/)
* [Getting Started](https://www.chartjs.org/docs/latest/getting-started/index)
* [General](https://www.chartjs.org/docs/latest/general/data-structures)
* [Configuration](https://www.chartjs.org/docs/latest/configuration/index)
* [Charts](https://www.chartjs.org/docs/latest/charts/line)
* [Axes](https://www.chartjs.org/docs/latest/axes/index)
* [Developers](https://www.chartjs.org/docs/latest/developers/index)
* [Popular Extensions](https://github.com/chartjs/awesome)
* [Samples](https://www.chartjs.org/samples/)

In case you are looking for an older version of the docs, you will have to specify the specific version in the url like this: [https://www.chartjs.org/docs/2.9.4/](https://www.chartjs.org/docs/2.9.4/)

## Contributing

Instructions on building and testing Chart.js can be found in [the documentation](https://www.chartjs.org/docs/master/developers/contributing.html#building-and-testing). Before submitting an issue or a pull request, please take a moment to look over the [contributing guidelines](https://www.chartjs.org/docs/master/developers/contributing) first. For support, please post questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/chart.js) with the `chart.js` tag.

## License

Chart.js is available under the [MIT license](LICENSE.md).
