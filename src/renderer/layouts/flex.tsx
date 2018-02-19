import * as React from 'react'
import styled from 'styled-components'

export const FlexVertical = styled.div`
	display: flex;
	flex-direction: column;
`

export const FlexHorizental = styled.div`
	display: flex;
	flex-direction: row;
`

export const FlexItemFix = styled.div`
	flex-grow: 0;
	flex-shrink: 0;
`

export const FlexItemAdaptive = styled.div`
	flex-grow: 1;
	flex-shrink: 1;
`

export function withFlexVertical<P>(Comp: React.ComponentType<P>) {
	return styled(Comp) `
		display: flex;
		flex-direction: column;
	`
}

export function withFlexHorizental<P>(Comp: React.ComponentType<P>) {
	return styled(Comp) `
		display: flex;
		flex-direction: row;
	`
}

export function withFlexItemsCenter<P>(Comp: React.ComponentType<P>) {
	return styled(Comp) `
		align-items: center;
	`
}

export function withItemFix<P>(Comp: React.ComponentType<P>) {
	return styled(Comp) `
		flex-grow: 0;
		flex-shrink: 0;
	`
}

export function withItemAdaptive<P>(Comp: React.ComponentType<P>) {
	return styled(Comp) `
		flex-grow: 1;
		flex-shrink: 1;
	`
}
