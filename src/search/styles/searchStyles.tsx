import styled from "styled-components";

export const SearchBox = styled.div`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 36rem;
  padding: 8px 24px;
  background-color: white;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border-bottom: 1px solid var(--Grey-grey40, #f2f0ef);
`;
