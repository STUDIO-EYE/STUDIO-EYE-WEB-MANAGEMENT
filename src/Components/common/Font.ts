import styled from "styled-components";

export const media = {
  mobileWithImage: "only screen and (max-width: 1150px)",
  mobile: "only screen and (max-width: 390px)",
  half: "only screen and (max-width: 50rem)"
};

export const TitleLg = styled.span`
  font-size: 5rem;
  font-weight: 900;

  @media ${media.mobile} {
    font-size: 1.875rem;
    font-weight: 600;
  }
`;

export const TitleMd = styled.span`
  font-size: 2.25rem;
  font-weight: 600;

  @media ${media.mobile} {
    font-size: 1.625rem;
    font-weight: 600;
  }
`;

export const TitleSm = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  @media ${media.mobile} {
    font-size: 1.25rem;
    font-weight: 600;
  }
`;
export const TextLg = styled.span`
  font-size: 1.125rem;
  font-weight: 600;

  @media ${media.mobile} {
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

export const TableText=styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: black;

  @media ${media.half}{
    font-size: 0.8rem;
  }
`;

export const TextMd = styled.span`
  font-size: 1rem;
  font-weight: normal;

  @media ${media.mobile} {
    font-size: 1.125rem;
    font-weight: normal;
  }
`;

export const TextSm = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  @media ${media.mobile} {
    font-size: 1rem;
    font-weight: normal;
  }
`;

export const Caption = styled.span`
  font-size: 0.75rem;
  font-weight: normal;
  @media ${media.mobile} {
    font-size: 0.875rem;
    font-weight: normal;
  }
`;

export const Name = styled.span`
  font-size: 1rem;
  font-weight: 600;
  @media ${media.mobile} {
    font-size: 0.875rem;
    font-weight: bold;
  }
`;