import { useRef } from "react";
import styled from "styled-components";
import { ReactComponent as TagsIcon } from "../../../../assets/tags-svgrepo-com.svg";

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

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: fit-content;
  min-width: 60px;
  max-width: 220px;
  height: 20px;
  padding: 2px 5px;
  border-radius: 5px;
  background-color: #faf3c0;
  cursor: pointer;

  &:hover {
    background-color: #e6c60d80;
  }
`;

const TagPoint = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e6c60d;
  margin-right: 10px;
  flex-shrink: 0;
`;

const Tag = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`;

const TagsLogo = styled(TagsIcon)`
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
  onChange(newTags: string[]): void;
}

const Tags: React.FC<Props> = ({ tagsIDs, tags, onChange }) => {
  const newTagRef = useRef<HTMLInputElement | null>(null);

  return (
    <TagsContainer>
      <TagTitleWrapper>
        <TagsLogo />
        <TagTitle>Tags:</TagTitle>
      </TagTitleWrapper>
      <TagList>
        {tagsIDs &&
          tags &&
          tags.map((tag) => {
            if (tagsIDs?.includes(tag.id)) {
              return (
                <TagWrapper key={tag.id}>
                  <TagPoint />
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
