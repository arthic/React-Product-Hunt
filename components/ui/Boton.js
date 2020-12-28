import styled from '@emotion/styled'

// a es de enlaces
export const Boton = styled.a`
	display: block;
	font-weight: 700;
	text-transform: uppercase;
	border: 1px solid #d1d1d1;
	padding: .8rem 2rem;
	margin: 2rem auto;
	text-align: center;
	background-color: ${props => props.bgColor ? '#da552f': '#fff'};
	color: ${props => props.bgColor ? '#fff': '#000'};

	transition: ease-in .2s;

	&:last-of-type {
		margin-right: 0;
	}

	&:hover {
		cursor: pointer;
		background-color: ${props => props.bgColor ? '#b0492b': '#e1e1e1'};
	}
`
