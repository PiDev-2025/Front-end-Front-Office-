"use client";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import React from "react";
//@ts-ignore
import { cssInterop } from "nativewind";
import { LinearGradient as RNLinearGradient } from "react-native-linear-gradient";

cssInterop(RNLinearGradient, {
	className: "style",
});

const linearGradientStyle = tva({
	base: "",
});

export const LinearGradient = React.forwardRef(
	({ className, ...props }: any, ref?: any) => {
		return (
			<RNLinearGradient
				{...props}
				className={linearGradientStyle({ class: className })}
				ref={ref}
			/>
		);
	}
);
