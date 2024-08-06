import {ResponsiveLine} from "@nivo/line";
import React from "react";

export function ProductRevenueChart({product}) {
    if (product.monthlyRevenue.length === 0) return <span>No data to display</span>
    
    const monthlyRevenue = {
        id: "monthly",
        data: []
    };
    const totalRevenue = {
        id: "total",
        data: []
    };

    let totalValue = 0;
    product.monthlyRevenue.forEach(timedValue => {
        monthlyRevenue.data.push({x: new Date(timedValue.time), y: timedValue.value});
        totalValue += timedValue.value;
        totalRevenue.data.push({x: new Date(timedValue.time), y: totalValue});
    });
    const data = [monthlyRevenue, totalRevenue];
    return (
        <ResponsiveLine
            data={data}
            margin={{top: 50, right: 110, bottom: 50, left: 80}}
            xScale={{
                type: "time",
                format: "native",
                precision: "month"
            }}
            yScale={{
                type: "linear",
            }}
            axisBottom={{
                format: "%b %Y",
                tickValues: "every month",
                legend: "Time",
                legendOffset: 40,
                legendPosition: "middle"
            }}
            axisLeft={{
                format: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\''),
                legend: "Revenue",
                legendOffset: -60,
                legendPosition: "middle"
            }}
            enableGridX={true}
            enableGridY={false}
            colors={{scheme: "nivo"}}
            pointSize={10}
            pointColor={{theme: "background"}}
            pointBorderWidth={2}
            pointBorderColor={{from: "serieColor"}}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    );
}