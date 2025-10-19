from pydantic import BaseModel
from typing import List

class WordExtractionOutput(BaseModel):
    words: List[str]
    total_words: int
    language_level: str
    analysis: str
