import React, { ReactNode } from 'react';
import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataFio, DaDataGender, DaDataSuggestion } from './types';
import { HighlightWords } from './HighlightWords';

interface Props extends BaseProps<DaDataFio> {
  filterGender?: DaDataGender[];
  filterParts?: string[];
}

export class FioSuggestions extends BaseSuggestions<DaDataFio, Props> {
  loadSuggestionsUrl = 'https://api-app.sovcombank.ru/v1/cache/dadata/fio';

  getLoadSuggestionsData = (): Record<string, unknown> => {
    const { count, filterGender, filterParts } = this.props;
    const { query } = this.state;

    const requestPayload: Record<string, unknown> = {
      query,
      count: count || 10,
    };

    // Ограничение по полу
    if (filterGender) {
      requestPayload.gender = filterGender;
    }

    // Ограничение по части ФИО
    if (filterParts) {
      requestPayload.parts = filterParts;
    }

    return requestPayload;
  };

  protected getSuggestionKey = (suggestion: DaDataSuggestion<DaDataFio>): string =>
    `name:${suggestion.data.name || ''}surname:${suggestion.data.surname || ''}patronymic:${
      suggestion.data.patronymic || ''
    }`;

  protected renderOption = (suggestion: DaDataSuggestion<DaDataFio>): ReactNode => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? (
      renderOption(suggestion, query)
    ) : (
      <div>
        <HighlightWords
          highlightClassName={highlightClassName || 'react-dadata--highlighted'}
          words={this.getHighlightWords()}
          text={suggestion.value}
        />
      </div>
    );
  };
}
