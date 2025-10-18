from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from src.crews.base.llm import DEFAULT_LLM
from src.crews.random_phrase_crew.schemas import PhraseOutput

@CrewBase
class RandomPhraseCrew():
    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def phrase_creator(self) -> Agent:
        return Agent(
            config=self.agents_config['phrase_creator'],
            llm=DEFAULT_LLM
        )

    @task
    def phrase_generation_task(self) -> Task:
        return Task(
            config=self.tasks_config['phrase_generation_task'],
            output_pydantic=PhraseOutput
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential
        )
