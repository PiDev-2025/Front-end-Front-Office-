import React, { useRef, useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DataZoomComponent
} from 'echarts/components';
import { SVGRenderer, SvgChart } from '@wuba/react-native-echarts';

echarts.use([
    SVGRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DataZoomComponent
]);

const E_WIDTH = Dimensions.get('window').width - 48; // 24px padding on each side
const E_HEIGHT = 300;

interface MoodChartProps {
    moodEntries: Array<{
        timestamp: string;
        value: number;
    }>;
}

export const MoodChart = ({ moodEntries }: MoodChartProps) => {
    const svgRef = useRef(null);

    const chartData = useMemo(() => {
        const categories = moodEntries.map(entry => {
            const date = new Date(entry.timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }).reverse();

        const moodData = moodEntries.map(entry => entry.value).reverse();

        return {
            categories,
            moodData,
        };
    }, [moodEntries]);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            top: 40,
            right: 20,
            bottom: 40,
            left: 40,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const value = params[0].value;
                const time = params[0].axisValue;
                return `Mood: ${value}%<br/>Time: ${time}`;
            }
        },
        xAxis: {
            type: 'category',
            data: chartData.categories,
            axisLabel: {
                color: '#ffffff80',
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff20'
                }
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            splitLine: {
                lineStyle: {
                    color: '#ffffff20'
                }
            },
            axisLabel: {
                color: '#ffffff80',
                fontSize: 12,
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: 'Mood',
                type: 'line',
                data: chartData.moodData,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#6366f1'
                },
                lineStyle: {
                    width: 3,
                    color: '#6366f1'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#6366f140' },
                        { offset: 1, color: '#6366f100' }
                    ])
                }
            }
        ]
    };

    useEffect(() => {
        let chart;
        if (svgRef.current) {
            chart = echarts.init(svgRef.current, 'dark', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }

        return () => {
            chart?.dispose();
        };
    }, [option]);

    return (
        <View style={styles.container}>
            <SvgChart ref={svgRef} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: E_WIDTH,
        height: E_HEIGHT,
    },
}); 