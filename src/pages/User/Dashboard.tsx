import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";

const Wrapper = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  background-color: red;
  height: calc(100vh - 50px);
`;

const WorkspaceWrapper = styled.div`
  background-color: aliceblue;
  flex-grow: 1;
  height: calc(100vh - 50px);
`;

const Workspace = styled.div`
  width: 100px;
  height: 100px;
  background-color: aqua;
  margin: 10px;
`;

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <PrivateRoute>
      <Wrapper>
        <Sidebar>Sidebar</Sidebar>
        <WorkspaceWrapper>
          <Workspace
            onClick={() => {
              navigate("/workspace/workspace-1");
            }}
          >
            workspace1
          </Workspace>
          <Workspace>workspace2</Workspace>
          <Workspace>workspace3</Workspace>
          <Workspace>workspace4</Workspace>
        </WorkspaceWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Dashboard;
