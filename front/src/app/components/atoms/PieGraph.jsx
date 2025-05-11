import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieGraph = ({ labels, dataValues, title, legend, barColor, borderColor }) => {
    const chartRef = useRef(null);

    const [textColor, setTextColor] = useState('white');

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.update();
        }
    }, [labels, dataValues, textColor]);



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
    };

    return (
        <Pie data={data} options={options} />
    );

};

export default PieGraph;