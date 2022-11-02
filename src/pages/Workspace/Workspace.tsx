import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import produce from "immer";

const Wrapper = styled.div``;

const ProjectCard = styled.div`
  border: 1px #000 solid;
  width: 100px;
  height: 100px;
  margin: 5px;
`;

const Workspace = () => {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProjectHandler = async () => {
      if (!id) return;
      const workspaceRef = doc(db, "workspaces", id);
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        setIsExist(true);
        setProjects(docSnap.data().projects);
      } else {
        setIsExist(false);
      }
    };
    getProjectHandler();
  }, []);

  const projectList = () => {
    return (
      <>
        {isExist &&
          projects.map((project) => {
            return (
              <ProjectCard
                key={project.id}
                onClick={() => {
                  navigate(`/project/${project.id}`);
                }}
              >
                {project.title}
              </ProjectCard>
            );
          })}
        {isExist === false && <div>workspace not exist.</div>}
      </>
    );
  };

  return (
    <PrivateRoute>
      <Wrapper>{projectList()}</Wrapper>
    </PrivateRoute>
  );
};

export default Workspace;
