import React, { useState } from 'react';

/**
 * Modern SVG Area Trend Chart (Zero external dependencies)
 * Props:
 *   data: Array<{ day: string, Bookings: number }>
 *   height?: number
 *   strokeColor?: string
 */
export const AreaTrendChart = ({ data = [], height = 220, strokeColor = '#2563eb' }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    if (!data || data.length === 0) {
        return <div className="h-44 flex items-center justify-center text-xs text-slate-400">No trend data available</div>;
    }

    const paddingX = 40;
    const paddingY = 24;
    const width = 560;
    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingY * 2;

    const values = data.map(d => Number(d.Bookings || 0));
    const maxValue = Math.max(...values, 5);
    const minValue = 0;

    const getX = (idx) => {
        if (data.length <= 1) return paddingX + innerWidth / 2;
        return paddingX + (idx / (data.length - 1)) * innerWidth;
    };

    const getY = (val) => {
        const ratio = (val - minValue) / (maxValue - minValue || 1);
        return paddingY + innerHeight - ratio * innerHeight;
    };

    const points = data.map((d, i) => ({
        x: getX(i),
        y: getY(Number(d.Bookings || 0)),
        ...d
    }));

    // Generate smooth SVG curve path (cubic bezier)
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        const cp1y = p0.y;
        const cp2x = p0.x + (p1.x - p0.x) / 2;
        const cp2y = p1.y;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + innerHeight} L ${points[0].x} ${paddingY + innerHeight} Z`;

    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="w-full relative select-none">
            {hoveredIdx !== null && points[hoveredIdx] && (
                <div
                    className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-sm whitespace-nowrap transition-all duration-75"
                    style={{
                        left: `${(points[hoveredIdx].x / width) * 100}%`,
                        top: `${(points[hoveredIdx].y / height) * 100}%`,
                        marginTop: '-8px'
                    }}
                >
                    <span className="opacity-75">{points[hoveredIdx].day}: </span>
                    <span>{points[hoveredIdx].Bookings} Bookings</span>
                </div>
            )}

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
                        <stop offset="90%" stopColor={strokeColor} stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {gridLines.map((ratio, i) => {
                    const y = paddingY + innerHeight * ratio;
                    const val = Math.round(maxValue * (1 - ratio));
                    return (
                        <g key={i}>
                            <line
                                x1={paddingX}
                                y1={y}
                                x2={width - paddingX}
                                y2={y}
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-800"
                                strokeDasharray="3 3"
                                strokeWidth="1"
                            />
                            <text
                                x={paddingX - 10}
                                y={y + 3.5}
                                textAnchor="end"
                                className="text-[10px] fill-slate-400 font-mono font-medium"
                            >
                                {val}
                            </text>
                        </g>
                    );
                })}

                {/* Area fill */}
                <path d={areaD} fill="url(#areaGradient)" />

                {/* Line stroke */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Interactive points & vertical guideline */}
                {points.map((p, i) => {
                    const isHovered = hoveredIdx === i;
                    return (
                        <g key={i} className="cursor-pointer">
                            {isHovered && (
                                <line
                                    x1={p.x}
                                    y1={paddingY}
                                    x2={p.x}
                                    y2={paddingY + innerHeight}
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="2 2"
                                    opacity="0.6"
                                />
                            )}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={isHovered ? 6 : 4}
                                fill={isHovered ? strokeColor : '#ffffff'}
                                stroke={strokeColor}
                                strokeWidth={isHovered ? 3 : 2}
                                className="transition-all duration-150"
                            />
                            {/* Transparent wider hit area for easy hover on mobile/desktop */}
                            <rect
                                x={p.x - 20}
                                y={paddingY}
                                width={40}
                                height={innerHeight}
                                fill="transparent"
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            />
                            {/* X-axis label */}
                            <text
                                x={p.x}
                                y={height - 6}
                                textAnchor="middle"
                                className={`text-[11px] font-medium transition-colors ${
                                    isHovered ? 'fill-blue-600 dark:fill-blue-400 font-bold' : 'fill-slate-400'
                                }`}
                            >
                                {p.day}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

/**
 * Modern SVG Donut / Pie Chart (Zero external dependencies)
 * Props:
 *   data: Array<{ name: string, value: number }>
 *   colors?: string[]
 *   size?: number
 */
export const DonutChart = ({
    data = [],
    colors = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#06b6d4'],
    size = 160
}) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const validData = data.filter(d => Number(d.value) > 0);
    const total = validData.reduce((sum, d) => sum + Number(d.value || 0), 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400 font-medium">
                    No data
                </div>
            </div>
        );
    }

    const radius = 60;
    const strokeWidth = 22;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const slices = validData.reduce((acc, d, i) => {
        const prevAngle = acc.length > 0 ? acc[acc.length - 1].nextAngle : 0;
        const fraction = d.value / total;
        const strokeDasharray = `${fraction * circumference} ${circumference}`;
        const strokeDashoffset = -prevAngle * circumference;
        const color = colors[i % colors.length];
        acc.push({
            ...d,
            fraction,
            strokeDasharray,
            strokeDashoffset,
            color,
            index: i,
            nextAngle: prevAngle + fraction
        });
        return acc;
    }, []);

    return (
        <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                {slices.map((slice) => {
                    const isHovered = hoveredIdx === slice.index;

                    return (
                        <circle
                            key={slice.index}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                            strokeDasharray={slice.strokeDasharray}
                            strokeDashoffset={slice.strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-200 cursor-pointer"
                            onMouseEnter={() => setHoveredIdx(slice.index)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        />
                    );
                })}
            </svg>

            {/* Center Information */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                {hoveredIdx !== null && validData[hoveredIdx] ? (
                    <>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[90px]">
                            {validData[hoveredIdx].name}
                        </span>
                        <span className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            {validData[hoveredIdx].value}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400">
                            {Math.round((validData[hoveredIdx].value / total) * 100)}%
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Total
                        </span>
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                            {total}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

/**
 * Modern SVG Bar Chart (Zero external dependencies)
 * Props:
 *   data: Array<{ name: string, value: number }>
 *   colors?: string[]
 *   height?: number
 */
export const SimpleBarChart = ({
    data = [],
    colors = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#06b6d4'],
    height = 180
}) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    if (!data || data.length === 0) {
        return <div className="h-40 flex items-center justify-center text-xs text-slate-400">No data available</div>;
    }

    const paddingX = 36;
    const paddingY = 24;
    const width = 500;
    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingY * 2;

    const values = data.map(d => Number(d.value || 0));
    const maxValue = Math.max(...values, 5);

    const barWidth = Math.min(36, Math.max(16, innerWidth / (data.length * 2)));

    return (
        <div className="w-full relative select-none">
            {hoveredIdx !== null && data[hoveredIdx] && (
                <div
                    className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-sm whitespace-nowrap transition-all duration-75"
                    style={{
                        left: `${((paddingX + (hoveredIdx + 0.5) * (innerWidth / data.length)) / width) * 100}%`,
                        top: `${paddingY}px`,
                        marginTop: '-4px'
                    }}
                >
                    <span className="opacity-75">{data[hoveredIdx].name}: </span>
                    <span>{data[hoveredIdx].value}</span>
                </div>
            )}

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Horizontal grid lines */}
                {[0, 0.5, 1].map((ratio, i) => {
                    const y = paddingY + innerHeight * ratio;
                    const val = Math.round(maxValue * (1 - ratio));
                    return (
                        <g key={i}>
                            <line
                                x1={paddingX}
                                y1={y}
                                x2={width - paddingX}
                                y2={y}
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-800"
                                strokeDasharray="3 3"
                                strokeWidth="1"
                            />
                            <text
                                x={paddingX - 8}
                                y={y + 3.5}
                                textAnchor="end"
                                className="text-[10px] fill-slate-400 font-mono"
                            >
                                {val}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const step = innerWidth / data.length;
                    const barX = paddingX + i * step + (step - barWidth) / 2;
                    const barH = ((Number(d.value || 0)) / maxValue) * innerHeight;
                    const barY = paddingY + innerHeight - barH;
                    const color = colors[i % colors.length];
                    const isHovered = hoveredIdx === i;

                    return (
                        <g
                            key={i}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            {/* Hitbox */}
                            <rect
                                x={paddingX + i * step}
                                y={paddingY}
                                width={step}
                                height={innerHeight}
                                fill="transparent"
                            />
                            {/* Rounded Bar */}
                            <rect
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={Math.max(barH, 3)}
                                rx="5"
                                fill={color}
                                className={`transition-all duration-150 ${isHovered ? 'opacity-100 brightness-110' : 'opacity-90'}`}
                            />
                            {/* Label */}
                            <text
                                x={barX + barWidth / 2}
                                y={height - 6}
                                textAnchor="middle"
                                className={`text-[11px] font-medium transition-colors ${
                                    isHovered ? 'fill-blue-600 dark:fill-blue-400 font-bold' : 'fill-slate-400'
                                }`}
                            >
                                {d.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
