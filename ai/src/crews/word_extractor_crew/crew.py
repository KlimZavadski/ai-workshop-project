from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from src.crews.base.llm import DEFAULT_LLM
from src.crews.word_extractor_crew.schemas import WordExtractionOutput

@CrewBase
class WordExtractorCrew():
    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def word_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config['word_extractor'],
            llm=DEFAULT_LLM
        )

    @task
    def word_extraction_task(self) -> Task:
        return Task(
            config=self.tasks_config['word_extraction_task'],
            output_pydantic=WordExtractionOutput
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential
        )
