import styled from "styled-components";
import { ReactComponent as tagsIcon } from "../../../../assets/tags-svgrepo-com.svg";

const TagsContainer = styled.div`
  margin: 0px 10px;
`;

const TagTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TagTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 5px 0px;
`;

const TagWrapper = styled.div<{ colorCode: string }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: fit-content;
  min-width: 60px;
  max-width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 20px;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;

  &::before {
    position: absolute;
    content: "";
    left: 0px;
    width: 100%;
    border-radius: 5px;
    height: 20px;
    background-color: ${(props) => props.colorCode};
    z-index: -1;
    opacity: 0.4;
  }

  &:hover {
    &::before {
      opacity: 0.7;
    }
  }
`;

const TagPoint = styled.div<{ colorCode: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.colorCode};
  margin-right: 10px;
  flex-shrink: 0;
`;

const Tag = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`;

const TagsIcon = styled(tagsIcon)`
  height: 20px;
  width: 20px;
  margin: 0px 3px;

  path {
    fill: #333;
  }
`;

interface Props {
  tagsIDs: string[] | undefined;
  tags: { id: string; colorCode: string; title: string }[] | undefined;
}

const Tags: React.FC<Props> = ({ tagsIDs, tags }) => {
  return (
    <TagsContainer>
      <TagTitleWrapper>
        <TagsIcon />
        <TagTitle>Tags:</TagTitle>
      </TagTitleWrapper>
      <TagList>
        {tagsIDs &&
          tags &&
          tags.map((tag) => {
            if (tagsIDs?.includes(tag.id)) {
              return (
                <TagWrapper key={tag.id} colorCode={tag.colorCode}>
                  <TagPoint colorCode={tag.colorCode} />
                  <Tag>{tag.title}</Tag>
                </TagWrapper>
              );
            }
          })}
      </TagList>
    </TagsContainer>
  );
};

export default Tags;
