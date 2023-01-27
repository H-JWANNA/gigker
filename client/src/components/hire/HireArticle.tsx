import React, { useState, useEffect } from "react";
import { CardProps, ServerData } from "./CardProps";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../util/redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ReactComponent as LeftArrow } from "../../assets/leftarrow.svg";
import { ReactComponent as RightArrow } from "../../assets/rightarrow.svg";

const mapDataToCardProps = (data: ServerData): CardProps => {
  return {
    title: data.title,
    nickName: data.nickName,
    price: data.price,
    workTimes: data.workTimes,
    memberId: data.memberId,
    location: data.cityName,
    categories: data.categoryName,
    tag: data.contentTags[0].tagName,
    contentId: data.contentId,
  };
};

const HireArticle: React.FC = (card) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async (contentType: string) => {
      try {
        const response = await axios.get(
          "http://ec2-43-201-27-162.ap-northeast-2.compute.amazonaws.com:8080/contents",
          {
            params: {
              contentType: contentType,
            },
          }
        );
        if (response.data.data) {
          setCards(response.data.data.map(mapDataToCardProps));
        } else {
          console.log("Data is undefined or null, cannot map to CardProps.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData("BUY");
  }, []);

  const handleClick = (contentId: number) => {
    navigate(`/hireDetail/${contentId}`);
  };

  const selectedCategory = useSelector(
    (state: RootState) => state.DropDown.selectedCategory
  );
  const selectedLocation = useSelector(
    (state: RootState) => state.DropDown.selectedLocation
  );
  const selectedTag = useSelector(
    (state: RootState) => state.DropDown.selectedTag
  );
  const filteredCards =
    selectedCategory === "카테고리" &&
    selectedLocation === "지역" &&
    selectedTag === ""
      ? cards
      : cards.filter(
          (card) =>
            (selectedCategory === "카테고리" ||
              card.categories === selectedCategory) &&
            (selectedLocation === "지역" ||
              card.location === selectedLocation) &&
            (!selectedTag || card.tag === selectedTag)
        );

  return (
    <div>
      <HireArticleContainer>
        {filteredCards
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((card, index) => (
            <Card key={index} onClick={() => handleClick(card.contentId)}>
              <CardTitle>{card.title}</CardTitle>
              <CardWriter>
                <span className="sub-title">작성자</span> {card.nickName}
              </CardWriter>
              <CardPay>
                <span className="sub-title">보수</span> {card.price}
              </CardPay>
              {card.workTimes && (
                <>
                  <CardStart>
                    <span className="sub-title">시작시간</span>
                    {new Date(card.workTimes[0].startWorkTime).toLocaleString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </CardStart>
                  <CardEnd>
                    <span className="sub-title">종료시간</span>
                    {new Date(card.workTimes[0].endWorkTime).toLocaleString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </CardEnd>
                </>
              )}
            </Card>
          ))}
      </HireArticleContainer>
      <PaginateContainer>
        <ReactPaginate
          previousLabel={<LeftArrow />}
          nextLabel={<RightArrow />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredCards.length / itemsPerPage)}
          marginPagesDisplayed={0}
          pageRangeDisplayed={5}
          onPageChange={(page) => setCurrentPage(page.selected + 1)}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
        />
      </PaginateContainer>
    </div>
  );
};

const PaginateContainer = styled.div`
  .page-item {
    width: 30px;
    height: 30px;
    border: 1px solid #a9a9a9;
    display: flex;
    justify-content: center;
    padding: 4px;
    margin: 0 2px 2px 0;
    font-size: 18px;
    cursor: pointer;
    &: hover {
      background-color: #6667ab;
      transition: all 0.5s;
    }
  }
  .break-me {
    color: #6667ab;
  }
  .active {
    color: #fcc72c;
    background-color: #6667ab;
    display: flex;
    justify-content: center;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 30px;
    color: #251749;
  }
`;

const HireArticleContainer = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left: 60px;
  margin-right: 60px;
`;

// const StyledLink = styled(Link)`
//   text-decoration: none;
//   color: black;
//   cursor: pointer;
// `;

const Card = styled.div`
  width: 230px;
  height: 150px;
  border: 1px solid #ccc;
  margin: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  padding-top: 15px;
  padding-left: 10px;
  :after {
    content: "";
    display: flex;
    margin-left: 10px;
    margin-top: 10px;
    width: 200px;
    border-bottom: 1px solid #ccc;
  }
`;

const CardWriter = styled.div`
  font-size: 14px;
  text-align: left;
  word-spacing: 2px;
  padding-left: 10px;
  .sub-title {
    color: #6667ab;
    padding-right: 5px;
  }
`;

const CardPay = styled.div`
  font-size: 14px;
  text-align: left;
  word-spacing: 2px;
  padding-left: 10px;
  .sub-title {
    color: #6667ab;
    padding-right: 5px;
  }
`;

const CardStart = styled.div`
  font-size: 14px;
  word-spacing: 2px;
  padding-left: 10px;
  .sub-title {
    color: #6667ab;
    padding-right: 5px;
  }
`;

const CardEnd = styled.div`
  font-size: 14px;
  word-spacing: 2px;
  padding-left: 10px;
  .sub-title {
    color: #6667ab;
    padding-right: 5px;
  }
`;

export default HireArticle;
