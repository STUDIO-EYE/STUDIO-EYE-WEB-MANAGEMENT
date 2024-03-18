import styled from "styled-components";

export const media = {
  mobileWithImage: "only screen and (max-width: 1150px)",
  mobile: "only screen and (max-width: 390px)",
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
  font-size: 1.5rem;
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
  font-weight: normal;
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
