import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const BarGraph = ({ rawData, title, legend, barColor, borderColor }) => {

    const [textColor, setTextColor] = useState('white');

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    setTextColor(isDark ? 'white' : 'black');
                }
            });
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    

    // Process data for Chart.js
    const labels = rawData.map(item => item.languageName);
    const dataValues = rawData.map(item => item.messageCount);

    const data = {
        labels,
        datasets: [
            {
                label: legend,
                data: dataValues,
                backgroundColor: barColor,
                borderColor: borderColor,
                borderWidth: 1,
            },
        ],
    };

    // Updated options for white text
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                },
            },
            title: {
                display: true,
                text: title,
                color: textColor,
                font: {
                    size: 16,
                },
            },
            tooltip: {
                bodyColor: textColor,
                titleColor: textColor,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                },
                grid: {
                    color: textColor === 'white' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: textColor,
                    stepSize: 1
                },
                grid: {
                    color: textColor === 'white' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <Bar data={data} options={options} />
    );
};

export default BarGraph;