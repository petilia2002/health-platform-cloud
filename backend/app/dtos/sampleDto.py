from typing import List
from datetime import datetime

from app.models.models import Sample


class SampleResultDto:
    def __init__(
        self,
        analyte_name: str,
        analyte_view_name: str,
        value: float,
        analyte_units: str,
        analyte_id: int,
    ):
        self.analyte_name = analyte_name
        self.analyte_view_name = analyte_view_name
        self.value = value
        self.analyte_units = analyte_units
        self.analyte_id = analyte_id

    def to_dict(self):
        return {
            "analyte_name": self.analyte_name,
            "analyte_view_name": self.analyte_view_name,
            "value": self.value,
            "units": self.analyte_units,
            "analyte_id": self.analyte_id,
        }


class SampleResponseDto:
    def __init__(
        self,
        id: int,
        upload_date: datetime,
        update_date: datetime,
        results: List[SampleResultDto],
    ):
        self.id = id
        self.upload_date = upload_date
        self.update_date = update_date
        self.results = results

    def to_dict(self):
        return {
            "id": self.id,
            "upload_date": self.upload_date,
            "update_date": self.update_date,
            "results": [
                result.to_dict()
                for result in sorted(self.results, key=lambda r: r.analyte_id)
            ],
        }


class SampleDtoBuilder:
    @staticmethod
    def build_from_sample(sample: Sample) -> SampleResponseDto:

        results_dto = [
            SampleResultDto(
                analyte_name=result.analyte.name,
                analyte_view_name=result.analyte.view_name,
                value=result.value,
                analyte_units=result.analyte.units,
                analyte_id=result.analyte_id,
            )
            for result in sample.sample_results
        ]

        return SampleResponseDto(
            id=sample.id,
            upload_date=sample.upload_date,
            update_date=sample.update_date,
            results=results_dto,
        )
