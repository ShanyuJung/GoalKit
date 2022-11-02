import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import {
  getDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";
import NewProject from "./components/NewProject";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const getProjectHandler = async () => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const workspaceRef = doc(db, "workspaces", id);
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        setIsExist(true);
        setProjects(docSnap.data().projects);
      } else {
        setIsExist(false);
      }
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const updateProjectHandler = async (projectTitle: string) => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const setRef = doc(collection(db, "projects"));
      const newProject = {
        id: setRef.id,
        lists: [],
        title: projectTitle,
      };
      await setDoc(setRef, newProject);
      const docRef = doc(db, "workspaces", id);
      const newObj = {
        id: setRef.id,
        title: projectTitle,
      };
      await updateDoc(docRef, { projects: arrayUnion(newObj) });
      await getProjectHandler();
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const newProjectHandler = (newProjectTitle: string) => {
    updateProjectHandler(newProjectTitle);
  };

  useEffect(() => {
    getProjectHandler();
  }, []);

  const projectList = () => {
    return (
      <>
        {isExist && (
          <>
            {projects.map((project) => {
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
            <NewProject onSubmit={newProjectHandler} />
          </>
        )}
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
